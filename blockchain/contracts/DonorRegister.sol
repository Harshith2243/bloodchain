// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Bdctoken.sol";

contract DonorRegister is Bdctoken {
    enum Gender   { Male, Female, Other }
    enum BloodGroup { AP, AN, BP, BN, OP, ON, ABP, ABN }

    struct Donor {
        string  name;
        uint8   age;
        string  place;
        uint256 mobile;
        bool    medicalCondition;
        Gender  donorGender;
        BloodGroup bloodGroup;
        bool    isActive;
        uint256 lastDonated;
        uint256 donationCount;
    }

    mapping(address => Donor) internal donors;

    event DonorRegistered(address indexed donorId, string name, BloodGroup bloodGroup);
    event DonorDeactivated(address indexed donorId);

    modifier donorExists(address id) {
        require(donors[id].isActive, "Donor not registered or inactive");
        _;
    }

    function setDonor(
        address _donorId,
        string  memory _name,
        uint8   _age,
        string  memory _place,
        uint256 _mobile,
        bool    _medCondition,
        Gender  _gender,
        BloodGroup _bloodGroup
    ) public {
        require(_donorId != owner, "Owner cannot be a donor");
        require(!donors[_donorId].isActive, "Donor already registered");
        require(_age >= 18 && _age <= 65, "Age must be between 18 and 65");
        require(!_medCondition, "Donor has a disqualifying medical condition");
        require(bytes(_name).length > 0, "Name cannot be empty");

        donors[_donorId] = Donor({
            name:             _name,
            age:              _age,
            place:            _place,
            mobile:           _mobile,
            medicalCondition: _medCondition,
            donorGender:      _gender,
            bloodGroup:       _bloodGroup,
            isActive:         true,
            lastDonated:      0,
            donationCount:    0
        });

        emit DonorRegistered(_donorId, _name, _bloodGroup);
    }

    function getDonor(address _donorId)
        public
        view
        donorExists(_donorId)
        returns (
            string memory  dName,
            uint8          age,
            string memory  place,
            Gender         donorGender,
            BloodGroup     bloodGroup,
            bool           medicalCondition,
            uint256        lastDonated,
            uint256        donationCount,
            uint256        tokenBalance
        )
    {
        Donor storage d = donors[_donorId];
        return (
            d.name,
            d.age,
            d.place,
            d.donorGender,
            d.bloodGroup,
            d.medicalCondition,
            d.lastDonated,
            d.donationCount,
            balanceOf(_donorId)
        );
    }

    function deactivateDonor(address _donorId) public onlyOwner donorExists(_donorId) {
        donors[_donorId].isActive = false;
        emit DonorDeactivated(_donorId);
    }
}