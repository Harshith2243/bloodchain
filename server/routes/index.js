var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blood Donor Chain' });
});
router.post('/setDonor',async function(req,res,next){
  // res.send(req.body); Testing post
  let data = req.body;
 
  //using instance of the contract to set donor data variables

  /*
   medCounter and array med[] is used to check wether 3or more medical conditions turns to be true
  */
  let medCounter = 0;
  med =[];
  med.push(data.mCondition1,data.mCondition2,data.mCondition3,data.mCondition4,data.mCondition5);

  for(i=0;i<med.length;i++){
      if(med[i] == "true")
        medCounter++;
  }
  if(medCounter >= 3){
     mCondition = true; //med conition set to true so that donor is rejected
  }
  else
    mCondition = false; //med condition set to false 

  try {
    const age = parseInt(data.age) || 0;
    const mob = parseInt(data.mobno) || 0;
    const gender = parseInt(data.gender) || 0;
    const bloodGroup = parseInt(data.bloodGroup) || 0;
    
    await Contractinstance.methods.setDonor(
      data.donorno.toLowerCase(),
      data.donorName,
      age,
      data.location,
      mob,
      mCondition,
      gender,
      bloodGroup
    ).send({ from: global.account, gas: 600000 }).then((txn) => {
      res.send("Donor " + data.donorno + " has been registered");
    });
  } catch (err) {
    res.status(500).send(err.message);

  }
});

router.get('/getDonor', async (req, res, next) => {
  let data = req.query;
  try {
    const result = await Contractinstance.methods.getDonor(data.search.toLowerCase()).call();
    res.json({
      name: result.dName,
      age: Number(result.age),
      place: result.place,
      gender: GENDERS[Number(result.donorGender)],
      bloodGroup: BLOOD_GROUPS[Number(result.bloodGroup)],
      medicalCondition: result.medicalCondition,
      lastDonated: Number(result.lastDonated),
      donationCount: Number(result.donationCount),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });

  }
})

router.post("/setRequest", async (req, res) => {
  let data = req.body;
  try {
    const bloodGroupReq = parseInt(data.reqbloodGroup) || 0;
    await Contractinstance.methods.setReq(
      data.bankAddr.toLowerCase(),
      data.reqlocation,
      bloodGroupReq
    ).send({ from: global.account, gas: 600000 }).then((txn) => {
      res.send("Request " + data.bankAddr + " has been registered");
    })
  } catch (err) {
    res.status(500).send(err.message);

  }
})
///Route for Accepting Request
router.post("/acceptRequest", async (req, res) => {
  let data = req.body;
  try {
    await Contractinstance.methods.acceptReq(data.donoraddr, data.reqaddr).send({ from: global.account, gas: 6000000 }).then((txn) => {
      Contractinstance.methods.getSample(data.donoraddr).call({ from: global.account }).then((donortx) => {
        Contractinstance.methods.getReq(data.reqaddr).call({ from: global.account }).then((reqtxn) => {
                  //to check the locations are matching or not as comparing string datatype not possible in solidity
                  if(donortx._place == reqtxn._location){
                    res.send("Request "+ data.reqaddr +" has been accepted by Donor " + data.donoraddr);

                  }
                  else{
                    res.send("Locations not matching");
                  }
                })
              })
                 
        })
  } catch (err) {
    await res.send(err.message);

  }  
})
module.exports = router;
