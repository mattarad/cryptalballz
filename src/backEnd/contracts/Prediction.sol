// SPDX-License-Identifier: DO NOT COPY WITH OUT WRITTEN CONSENT.

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/utils/Counters.sol";


contract Prediction {
    using Counters for Counters.Counter;


    address payable public admin;

    Counters.Counter public totalPredictionMarkets;
    Counters.Counter public totalActivePredictionMarkets;
    Counters.Counter public totalClosedPredictionMarkets;
    Counters.Counter public totalSettledPredictionMarkets;
    Counters.Counter public totalEmergencyWithdrawPredictionMarkets;

    // basis points
    uint256 public predictionMarketFee;
    uint256 public userWithdrawADMINFee;
    uint256 public userWithdrawPOOLFee;
    uint256 public minPredictionValue;

    uint256 public totalPredictionVolume;

    enum Status{
        Active,
        Closed,
        Settled,
        EmergencyWithdraw
    }
    enum Settlement{
        Yes,
        No,
        Active,
        EmergencyWithdraw
    }

    struct UserPrediction{
        address payable predictor;
        // uint256 predictorID;
        uint256 predictionAmount;
        uint256 payoutAmount;
        uint256 emergencyWithdrawAmount;
        bool prediction;
        bool hasPredicted;
        bool paidOut;
        bool emergecyWithdraw;
    }

    struct PredictionData{
        string predictionPhrase;
        uint256 id;
        // uint256 startBlock;
        uint256 endBlock;
        uint256 yesUserNumber;
        uint256 noUserNumber;
        uint256 totalUserNumber;
        uint256 yesBalance;
        uint256 noBalance;
        uint256 totalBalance;
        uint256 totalPaidOut;
        // address[] yesAddresses;
        // address[] noAddresses;
        Status status;
        Settlement settlement;
    }

    event PredictionMarketActive(
        string phrase,
        uint256 id
    );

    event PredictionMade(
        address predictor,
        uint256 id,
        uint256 predictionValue,
        uint256 predictionTotalValue,
        uint256 predictionsMade,
        uint256 totalPredictionVolume
    );

    event PredictionClosed(
        uint256 id,
        uint256 totalUserNumber,
        uint256 totalBalance
    );

    event PredictionSettled(
        uint256 id,
        uint256 totalUserNumber,
        uint256 totalBalance,
        Settlement Settlement
    );

    event EmergencyWithdrawalActive(
        uint256 id,
        uint256 totalUsersNumber,
        uint256 totalBalance
    );

    event UserWithdrawal(
        uint256 id,
        uint256 totalBalance
    );


    //Prediction ID -> user address -> user prediction data set
    mapping(uint256 => mapping(address => UserPrediction)) public userPredictions;

    // Prediction ID -> prediction data
    mapping(uint256 => PredictionData) public predictions;

    constructor() {
        admin = payable(msg.sender);
        predictionMarketFee = 250;
        userWithdrawADMINFee = 700;
        userWithdrawPOOLFee = 500;
        minPredictionValue = 10000000000000000;
    }

    modifier onlyAdmin {
        require(msg.sender == admin, "you must be the admin");
        _;
    }

    function createPredictionMarket(string memory _predictionPhrase, uint256 _activeSeconds) public onlyAdmin {
        // require(bytes32(_predictionPhrase) > 0, "must enter vaid prediction phrase.");
        totalPredictionMarkets.increment();
        totalActivePredictionMarkets.increment();
        uint256 predictionMarketID = totalPredictionMarkets.current();
        // address[] memory emptyAdressList;


        predictions[predictionMarketID] = PredictionData(
                _predictionPhrase,
                predictionMarketID, block.timestamp + _activeSeconds,
                0, 0, 0, 0, 0, 0, 0, Status.Active, Settlement.Active
            );
        // create event
        emit PredictionMarketActive(_predictionPhrase, predictionMarketID);
    }

    function makePrediction(uint256 _predictionID, bool _prediction) external payable {
        require(msg.value >= minPredictionValue, "must send a value greater than minPredictionValue.");
        require(_predictionID > 0 && _predictionID <= totalPredictionMarkets.current(), "invalid prediction ID.");
        require(predictions[_predictionID].status == Status.Active, "prediction not ACTIVE.");
        bool _userHasPredicted = userPredictions[_predictionID][msg.sender].hasPredicted;
        require(!_userHasPredicted, "you have already made your prediction.");

        if(_prediction) {
            predictions[_predictionID].yesBalance += msg.value;
            predictions[_predictionID].yesUserNumber++;
            userPredictions[_predictionID][msg.sender] = UserPrediction(payable(msg.sender), msg.value, 0, 0, _prediction, true, false, false);
        } else {
            predictions[_predictionID].noBalance += msg.value;
            predictions[_predictionID].noUserNumber++;            
            userPredictions[_predictionID][msg.sender] = UserPrediction(payable(msg.sender), msg.value, 0, 0, _prediction, true, false, false);
        }

        predictions[_predictionID].totalUserNumber++;
        predictions[_predictionID].totalBalance += msg.value;
        totalPredictionVolume += msg.value;
        

        emit PredictionMade(
                msg.sender,
                _predictionID,
                msg.value,
                predictions[_predictionID].totalBalance,
                predictions[_predictionID].totalUserNumber,
                totalPredictionVolume
                );
    }

    function setllePrediction(uint256 _predictionID, bool _settlement) external onlyAdmin {
        {
            require(predictions[_predictionID].status == Status.Closed, "prediction market not closed.");
            require(_predictionID > 0 && _predictionID <= totalPredictionMarkets.current(), "invalid prediction ID.");
        }
        // uint256 _predictionBalance = predictions[_predictionID].totalBalance;
        // require(_predictionBalance <= (address(this).balance), "the contract doesn't have enough for payouts.");

        uint256 _adminFee = calcFee(predictions[_predictionID].totalBalance, predictionMarketFee);
        // uint256 _payoutSent = 0;
        // _predictionBalance -= _adminFee;

        predictions[_predictionID].totalPaidOut += _adminFee;

        admin.transfer(_adminFee);

        _settlement
            ? predictions[_predictionID].settlement = Settlement.Yes
            : predictions[_predictionID].settlement = Settlement.No;

        predictions[_predictionID].status = Status.Settled;
        totalClosedPredictionMarkets.decrement();
        totalSettledPredictionMarkets.increment();

        emit PredictionSettled(
                _predictionID,
                predictions[_predictionID].totalUserNumber,
                predictions[_predictionID].totalBalance,
                predictions[_predictionID].settlement
            );
    }

    function claim(uint256 _predictionID) external payable returns(uint256 _payout) {
        {
            require(predictions[_predictionID].status == Status.Settled, "prediction is not claimable.");
        }
        bool _settlement = predictions[_predictionID].settlement == Settlement.Yes;
        {   
            require(userPredictions[_predictionID][msg.sender].prediction == _settlement, "prediction did not settle in your favor.");

            require(userPredictions[_predictionID][msg.sender].hasPredicted, "you either didn't make a prediction or you withdrew your prediction.");

            require(!userPredictions[_predictionID][msg.sender].paidOut, "you have already been paid out.");
        }

        userPredictions[_predictionID][msg.sender].paidOut = true;

        // userPredictions[_predictionID][msg.sender];

        {
            uint256 _predictionBalance = predictions[_predictionID].totalBalance;
            uint256 _adminFee = calcFee(_predictionBalance, predictionMarketFee);
            uint256 _balMinusFee = _predictionBalance - _adminFee;

            uint256 userBal = _settlement ? (predictions[_predictionID].yesBalance) : (predictions[_predictionID].noBalance);

            uint256 _payoutBP = (userPredictions[_predictionID][msg.sender].predictionAmount * 10000) / userBal;
            _payout = (_balMinusFee * _payoutBP) / 10000;

            predictions[_predictionID].totalPaidOut += _payout;
        }

        {
            require(userPredictions[_predictionID][msg.sender].payoutAmount == 0, "you have already been paid out.");
        }
        userPredictions[_predictionID][msg.sender].payoutAmount = _payout;
        payable(msg.sender).transfer(_payout);

    }

    function closePrediction(uint256 _predictionID) public onlyAdmin {
        require(_predictionID > 0 && _predictionID <= totalPredictionMarkets.current(), "invalid prediction ID.");
        require(predictions[_predictionID].status == Status.Active, "prediction market not ACTIVE.");
        predictions[_predictionID].status = Status.Closed;
        totalActivePredictionMarkets.decrement();
        totalClosedPredictionMarkets.increment();
        emit PredictionClosed(_predictionID, predictions[_predictionID].totalUserNumber, predictions[_predictionID].totalBalance );
    }

    function fetchAllMarkets() public view returns (PredictionData[] memory) {
        uint256 totalMarkets = totalPredictionMarkets.current();
        uint256 _currentIndex = 0;
        PredictionData[] memory _result = new PredictionData[](totalMarkets);
        for(uint256 i = 1; i <= totalMarkets; i++) {
            uint256 _predictionID = i;
            PredictionData memory _currentPredictionData = predictions[_predictionID];
            _result[_currentIndex] = _currentPredictionData;
            _currentIndex++;
        }
        return _result;
    }

    function fetchAllActiveMarkets() public view returns (PredictionData[] memory) {
        uint256 activeMarkets = totalActivePredictionMarkets.current();
        uint256 totalMarkets = totalPredictionMarkets.current();
        
        uint256 _currentIndex = 0;
        PredictionData[] memory _result = new PredictionData[](activeMarkets);
        for(uint256 i = 1; i <= totalMarkets; i++) {
            uint256 _predictionID = i;
            bool _active = predictions[_predictionID].status == Status.Active;
            if(_active) {
                PredictionData memory _currentPredictionData = predictions[_predictionID];
                _result[_currentIndex] = _currentPredictionData;
                _currentIndex++;
            }
        }
        return _result;
    }
    function fetchAllClosedMarkets() public view returns (PredictionData[] memory) {
        uint256 totalMarkets = totalPredictionMarkets.current();
        uint256 closedMarkets = totalClosedPredictionMarkets.current();
        uint256 _currentIndex = 0;
        PredictionData[] memory _result = new PredictionData[](closedMarkets);
        for(uint256 i = 1; i <= totalMarkets; i++) {
            uint256 _predictionID = i;
            bool _closed = predictions[_predictionID].status == Status.Closed;
            if(_closed) {
                PredictionData memory _currentPredictionData = predictions[_predictionID];
                _result[_currentIndex] = _currentPredictionData;
                _currentIndex++;
            }
        }
        return _result;
    }
    function fetchAllSettledMarkets() public view returns (PredictionData[] memory) {
        uint256 totalMarkets = totalPredictionMarkets.current();
        uint256 settledMarkets = totalSettledPredictionMarkets.current();
        uint256 _currentIndex = 0;
        PredictionData[] memory _result = new PredictionData[](settledMarkets);
        for(uint256 i = 1; i <= totalMarkets; i++) {
            uint256 _predictionID = i;
            bool _Settled = predictions[_predictionID].status == Status.Settled;
            if(_Settled) {
                PredictionData memory _currentPredictionData = predictions[_predictionID];
                _result[_currentIndex] = _currentPredictionData;
                _currentIndex++;
            }
        }
        return _result;
    }

    function updateAdmin(address _newAdmin) public onlyAdmin returns (bool){
        admin = payable(_newAdmin);
        return true;
    }
    function updatePredictionMarketFee(uint256 _newPredictionMarketFee) public onlyAdmin returns (bool){
        predictionMarketFee = _newPredictionMarketFee;
        return true;
    }

    function calcFee(uint256 _amountValue, uint256 _fee) internal pure returns(uint256) {
        // require((_amountValue / 10000) * 10000 == _amountValue, "too small");
        uint256 fee = 0;
        if((_amountValue / 10000) * 10000 == _amountValue) {
            _amountValue = _amountValue;
            fee = _amountValue * _fee / 10000;
        }
        return fee;
    }

    function emergencyWithdrawal(uint256 _predictionID) external payable returns(uint256 _amount) {
        require(predictions[_predictionID].status == Status.EmergencyWithdraw, "prediction must be set as Emergency Withdrawal.");
        require(userPredictions[_predictionID][msg.sender].emergecyWithdraw == false, "you have already done an emergency withdraw.");
        userPredictions[_predictionID][msg.sender].emergecyWithdraw = true;
    
        _amount = userPredictions[_predictionID][msg.sender].predictionAmount;
        userPredictions[_predictionID][msg.sender].predictionAmount = 0;

        require(userPredictions[_predictionID][msg.sender].emergencyWithdrawAmount == 0, "You have already done and emergency withdraw.");

        userPredictions[_predictionID][msg.sender].emergencyWithdrawAmount = _amount;


        payable(msg.sender).transfer(_amount);
    }

    function enableEmergencyWithdraw(uint256 _predictionID) external onlyAdmin {
        require(predictions[_predictionID].status == Status.Closed, "prediction must be set to closed.");
        
        totalClosedPredictionMarkets.decrement();
        totalEmergencyWithdrawPredictionMarkets.increment();
        totalSettledPredictionMarkets.increment();

        predictions[_predictionID].status = Status.Settled;
        predictions[_predictionID].settlement = Settlement.EmergencyWithdraw;

        emit EmergencyWithdrawalActive(
                _predictionID,
                predictions[_predictionID].totalUserNumber,
                predictions[_predictionID].totalBalance
            );

    }
    
    function userWithdraw(uint256 _predictionID) external payable {
        {
            require(_predictionID > 0 && _predictionID <= totalPredictionMarkets.current(), "invalid prediction ID.");
            require(predictions[_predictionID].status == Status.Active, "prediction not ACTIVE.");
        }
        uint256 _userPredictionAmount = userPredictions[_predictionID][msg.sender].predictionAmount;
        uint256 _userOriginalAmount = userPredictions[_predictionID][msg.sender].predictionAmount;
        uint256 _adminFee = calcFee(_userPredictionAmount, userWithdrawADMINFee);
        uint256 _poolFee = calcFee(_userPredictionAmount, userWithdrawPOOLFee);
        uint256 _totalFees = _adminFee + _poolFee;


        _userPredictionAmount -= _totalFees;

        admin.transfer(_adminFee);

        bool _userHasPredicted = userPredictions[_predictionID][msg.sender].hasPredicted;
        {
            require(_userHasPredicted, "you can only withdraw if you have made an open prediction.");
        }
        
        require(_userPredictionAmount > 0, "you don't have any funds to withdraw.");
        userPredictions[_predictionID][msg.sender].predictionAmount = 0;
        userPredictions[_predictionID][msg.sender].hasPredicted = false;
        payable(msg.sender).transfer(_userPredictionAmount);


        uint256 _deductionFromTotalBalance = _userPredictionAmount + _adminFee;
        predictions[_predictionID].totalBalance -= _deductionFromTotalBalance;

        if(userPredictions[_predictionID][msg.sender].prediction) {
            // predictions[_predictionID].yesBalance -= _deductionFromTotalBalance;
            predictions[_predictionID].yesBalance -= _userOriginalAmount;
            predictions[_predictionID].yesUserNumber--;
        } else {
            // predictions[_predictionID].noBalance -= _deductionFromTotalBalance;
            predictions[_predictionID].noBalance -= _userOriginalAmount;
            predictions[_predictionID].noUserNumber--;
        }
        predictions[_predictionID].totalUserNumber--;

        emit UserWithdrawal(_predictionID, predictions[_predictionID].totalBalance);
    }
}
