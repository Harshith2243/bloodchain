// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DonorRegister.sol";

contract Request is DonorRegister {
    uint256 public constant DONATION_COOLDOWN = 90 days;
    uint256 public constant REWARD_TOKENS     = 10;

    struct BloodRequest {
        address  requester;
        string   location;
        BloodGroup reqBloodGroup;
        bool     isFulfilled;
        uint256  createdAt;
        address  fulfilledBy;
    }

    uint256 public requestCount;
    mapping(uint256 => BloodRequest) public requests;
    mapping(address => uint256[]) public requesterHistory;
    mapping(address => uint256[]) public donorHistory;

    event RequestCreated(uint256 indexed reqId, address indexed requester, BloodGroup bloodGroup, string location);
    event RequestFulfilled(uint256 indexed reqId, address indexed donor, address indexed requester, uint256 tokensRewarded);

    function createRequest(string memory _location, BloodGroup _bloodGroup) public returns (uint256) {
        require(bytes(_location).length > 0, "Location required");
        requestCount++;
        requests[requestCount] = BloodRequest({
            requester:     msg.sender,
            location:      _location,
            reqBloodGroup: _bloodGroup,
            isFulfilled:   false,
            createdAt:     block.timestamp,
            fulfilledBy:   address(0)
        });
        requesterHistory[msg.sender].push(requestCount);
        emit RequestCreated(requestCount, msg.sender, _bloodGroup, _location);
        return requestCount;
    }

    function acceptRequest(uint256 _reqId) public donorExists(msg.sender) {
        BloodRequest storage req = requests[_reqId];
        Donor storage donor = donors[msg.sender];

        require(!req.isFulfilled, "Request already fulfilled");
        require(req.requester != msg.sender, "Cannot fulfill your own request");
        require(donor.bloodGroup == req.reqBloodGroup, "Blood group mismatch");
        require(
            block.timestamp >= donor.lastDonated + DONATION_COOLDOWN,
            "Donation cooldown active: must wait 90 days between donations"
        );

        req.isFulfilled   = true;
        req.fulfilledBy   = msg.sender;
        donor.lastDonated    = block.timestamp;
        donor.donationCount += 1;
        donorHistory[msg.sender].push(_reqId);

        transfer(msg.sender, REWARD_TOKENS);

        emit RequestFulfilled(_reqId, msg.sender, req.requester, REWARD_TOKENS);
    }

    function getOpenRequests() public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= requestCount; i++) {
            if (!requests[i].isFulfilled) count++;
        }
        uint256[] memory open = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= requestCount; i++) {
            if (!requests[i].isFulfilled) {
                open[idx++] = i;
            }
        }
        return open;
    }

    function getDonorHistory(address _donor) public view returns (uint256[] memory) {
        return donorHistory[_donor];
    }
}