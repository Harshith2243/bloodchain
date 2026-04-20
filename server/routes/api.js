const express = require('express');
const router  = express.Router();
const fs      = require('fs');
const path    = require('path');

const BLOOD_GROUPS = ['AP','AN','BP','BN','OP','ON','ABP','ABN'];
const GENDERS      = ['Male','Female','Other'];

// Helper to read JSON data
const readData = (filename) => {
  const filePath = path.join(__dirname, '../data', filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (e) {
    return [];
  }
};

const writeData = (filename, data) => {
  const filePath = path.join(__dirname, '../data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

router.get('/donor/:address', async (req, res) => {
  try {
    const addr = req.params.address;
    const result = await Contractinstance.methods.getDonor(addr).call();
    res.json({
      name: result.dName,
      age: Number(result.age),
      place: result.place,
      gender: GENDERS[Number(result.donorGender)],
      bloodGroup: BLOOD_GROUPS[Number(result.bloodGroup)],
      medicalCondition: result.medicalCondition,
      lastDonated: Number(result.lastDonated),
      donationCount: Number(result.donationCount),
      tokenBalance: Number(result.tokenBalance),
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Donor not found' });
  }
});

router.post('/donor', async (req, res) => {
  try {
    const { donorAddress, name, age, place, mobile, medCondition, gender, bloodGroup } = req.body;

    await Contractinstance.methods
      .setDonor(donorAddress, name, Number(age), place, mobile, medCondition === true, Number(gender), Number(bloodGroup))
      .send({ from: global.account, gas: 300000 });

    res.json({ success: true, message: `Donor ${name} registered successfully!` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- NEW SAAS FEATURES ---

const COMPATIBILITY = {
  'OP': ['OP', 'ABP', 'AP', 'BP'],
  'ON': ['OP', 'ON', 'ABP', 'ABN', 'AP', 'AN', 'BP', 'BN'],
  'AP': ['AP', 'ABP'],
  'AN': ['AP', 'AN', 'ABP', 'ABN'],
  'BP': ['BP', 'ABP'],
  'BN': ['BP', 'BN', 'ABP', 'ABN'],
  'ABP': ['ABP'],
  'ABN': ['ABP', 'ABN']
};

const RARE_GROUPS = ['ON', 'BN', 'ABN'];

// 1. Smart Donor Matching
router.get('/match-donors', (req, res) => {
  const { bloodGroup, location, expandRadius } = req.query;
  const donors = readData('donors.json');
  
  const compatibleGroups = COMPATIBILITY[bloodGroup] || [bloodGroup];
  
  let matches = donors.map(d => {
    let score = 0;
    let matchType = 'exact';

    // Blood Group matching
    if (d.bloodGroup === bloodGroup) {
      score += 10;
    } else if (compatibleGroups.includes(d.bloodGroup)) {
      score += 5;
      matchType = 'compatible';
    }

    // Location matching
    const donorLoc = d.location?.toLowerCase() || "";
    const searchLoc = location?.toLowerCase() || "";
    
    if (searchLoc && donorLoc.includes(searchLoc)) {
      score += 10;
    } else if (expandRadius === 'true') {
      // Simple radius expansion simulation: check if at least one word matches (e.g. "North London" matches "London")
      const words = searchLoc.split(' ');
      if (words.some(word => word.length > 3 && donorLoc.includes(word))) {
        score += 5;
        matchType = (matchType === 'exact') ? 'nearby' : 'compatible-nearby';
      }
    }

    // Availability & Health Score logic (SaaS Features)
    const daysSinceLast = (Date.now() - (d.lastDonated || 0) * 1000) / (24 * 60 * 60 * 1000);
    let availability = 'Available';
    if (daysSinceLast < 90) {
      availability = 'Recently Donated';
      score -= 5;
    }
    
    // Rare blood priority
    if (RARE_GROUPS.includes(d.bloodGroup)) {
      score += 2;
    }

    // Donor Reliability (based on history)
    const healthScore = Math.min(100, (d.donationCount || 0) * 10 + 50);

    return { 
      ...d, 
      score, 
      matchType, 
      availability, 
      healthScore, 
      isRare: RARE_GROUPS.includes(d.bloodGroup) 
    };
  });

  // Filter out non-matches and sort by score
  matches = matches
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score);

  res.json({ 
    matches,
    searchParams: { bloodGroup, location, expanded: expandRadius === 'true' }
  });
});

// 2. Nearby Hospitals
router.get('/hospitals', (req, res) => {
  const hospitals = readData('hospitals.json');
  res.json({ hospitals });
});

router.get('/requests', async (req, res) => {
  try {
    const openIds = await Contractinstance.methods.getOpenRequests().call();
    const urgentMap = readData('urgent_requests.json') || {};

    const requests = [];
    for (const id of openIds) {
      try {
        const r = await Contractinstance.methods.requests(id).call();
        requests.push({
          id: String(id),
          requester: r.requester,
          location: r.location,
          bloodGroup: BLOOD_GROUPS[Number(r.reqBloodGroup)],
          createdAt: Number(r.createdAt),
          isUrgent: !!urgentMap[String(id)]
        });
      } catch (innerErr) {
        console.error(`Error fetching request ${id}:`, innerErr);
      }
    }

    // Sort: Urgent first, then by creation time
    requests.sort((a, b) => {
      if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1;
      return Number(b.createdAt) - Number(a.createdAt);
    });

    res.json({ requests });
  } catch (err) {
    console.error("CRITICAL: GET /api/requests failed:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/request', async (req, res) => {
  try {
    const { location, bloodGroup, isUrgent } = req.body;

    const tx = await Contractinstance.methods
      .createRequest(location, Number(bloodGroup))
      .send({ from: global.account, gas: 200000 });

    if (isUrgent) {
      const count = await Contractinstance.methods.requestCount().call();
      const urgentMap = readData('urgent_requests.json') || {};
      urgentMap[count.toString()] = true;
      writeData('urgent_requests.json', urgentMap);
    }

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/accept', async (req, res) => {
  try {
    const { requestId, donorAddress } = req.body;

    const tx = await Contractinstance.methods
      .acceptRequest(Number(requestId))
      .send({ from: donorAddress || global.account, gas: 200000 });

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
