const { assert } = require('chai')

const Prediction = artifacts.require("Prediction")

require('chai')
    .use(require('chai-as-promised'))
    .should()

to_wei = n => {
    return web3.utils.toWei(n, 'ether')
}

returnBool = () => {
    let randomInt = Math.floor(Math.random() * 2)
    if(randomInt == 1) {
        return true
    } else {
        return false
    }
}

randomAmount = () => {
    let globalMax = 2000000000000000000
    let globalMin = 10000000000000000
    let ranInt = Math.floor(Math.random() * globalMax) + globalMin
    return ranInt
}

randomTime = () => {
    let maxTime = 10000
    let minTime = 1000
    let randTime = Math.floor(Math.random() * maxTime) + minTime
    return randTime
}

contract('Prediction', ([deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9]) => {
    let prediction, activeMarkets, closedMarkets, settledMarkets, emergencyMarkets, result, pred, admin
    let currentActive = 0
    let currentClosed = 0
    let currentSettled = 0
    let currentEmergency = 0
    let time = 0
    let phrase
    let marketId = 0

    let users = [
        {
            user: user1,
            predictionAmount: 0,
            prediction: null
        },
        {
            user: user2,
            predictionAmount: 0,
            prediction: null
        },
        {
            user: user3,
            predictionAmount: 0,
            prediction: null
        },
        {
            user: user4,
            predictionAmount: 0,
            prediction: null
        },
        {
            user: user5,
            predictionAmount: 0,
            prediction: null
        },
        {
            user: user6,
            predictionAmount: 0,
            prediction: null
        },
        {
            user: user7,
            predictionAmount: 0,
            prediction: null
        },
        {
            user: user8,
            predictionAmount: 0,
            prediction: null
        },
        {
            user: user9,
            predictionAmount: 0,
            prediction: null
        }
    ]

    before(async () => {
        prediction = await Prediction.new()
    })

    describe('createPredictionMarket()',async () => {
        time = randomTime()
        phrase = 'This is a test 1'
        
        before(async () => {
            result = await prediction.createPredictionMarket(phrase, time)
            currentActive++;
            marketId++
        })
        it('has a market number', async () => {
            let marketnumber = await prediction.totalPredictionMarkets()
            assert.equal(marketnumber, marketId)
        })

        it('checks prediction phrase', async () => {
            pred = await prediction.predictions(marketId)
            assert.equal(pred.predictionPhrase.toString(), phrase)
            // assert.should.equal(pred.endBlock > time)
        })
        it('has an admin set as deployer', async () => {
            admin = await prediction.admin()
            assert.equal(admin, deployer)
        })
    })

    describe('make predictions', async () => {
        before(async () => {
            users.forEach(user => {
                user.predictionAmount = randomAmount()
                user.prediction = returnBool()
                console.log(user.predictionAmount)
                // console.log(user.prediction)
                // console.log(user.user)
            })
        })
        it('each user makes prediction', async () => {
            users.forEach(async user=> {
                let predictionUserData = await prediction.makePrediction(
                        marketId,
                        user.prediction,
                        { from: user.user, value: user.predictionAmount }
                    )
                // console.log(predictionUserData.logs[0].event)
                // console.log(user.user)
                // console.log(user.predictionAmount)
                // console.log(user.prediction)
            })
        })
        it('should return the correct users predicted', async () => {
            // let totalUserNumber
            // let predictionData = await prediction.predictions(marketId)
            // totalUserNumber = predictionData.totalUserNumber.toNumber()
            // console.log(predictionData.totalUserNumber.toNumber())
            // // console.log(totalUserNumber)
            // console.log(totalUserNumber + "  thbanber")
            // // console.log(totalUserNumber.toNumber())
            // assert.equal(users.length, totalUserNumber)
        })
        it('should return the correct yes/no prediction numbers', async () => {
            let yesCount = 0, noCount = 0, yesUserNumber = 0, noUserNumber = 0, totalUserNumber = 0
            users.forEach(async user => {
                user.prediction ? yesCount++ : noCount++
            })
            let predictionData = await prediction.predictions(marketId)
            yesUserNumber += predictionData.yesUserNumber.toNumber()
            noUserNumber += predictionData.noUserNumber.toNumber()
            totalUserNumber += predictionData.totalUserNumber.toNumber()
            console.log(totalUserNumber + "-----" + totalUserNumber)
            console.log(yesUserNumber + ".  .. ... " + noUserNumber)
            console.log(yesCount + " .  ,,, . " + noCount)


            // assert.equal(yesCount, yesUserNumber)
            // assert.equal(noCount, noUserNumber)
            // assert.equal(users.length, totalUserNumber)
        })
    })
    describe("withdraws prediction", async () => {

        it("should be able to withdraw", async () => {
            let user1Bal, user6Bal
            user1Bal = await web3.eth.getBalance(user1)
            user6Bal = await web3.eth.getBalance(user6)
            let us1Bal = await prediction.userPredictions(marketId, user1)
            let us6Bal = await prediction.userPredictions(marketId, user6)
            await prediction.userWithdraw(marketId, { from: user1 })
            await prediction.userWithdraw(marketId, { from: user6 })
            let new_user1Bal = await web3.eth.getBalance(user1)
            let new_user6Bal = await web3.eth.getBalance(user6)
            let bal1Bool = user1Bal < new_user1Bal ? true : false
            let bal6Bool = user1Bal < new_user6Bal ? true : false
            console.log(us1Bal +  " ------  " +  new_user1Bal)
            console.log(us6Bal +  " ------  " +  new_user6Bal)
            assert.equal(true, bal1Bool)
            assert.equal(true, bal6Bool)
        })
        it('should allow to remake a prediction', async () => {
            users[0].prediction = !users[0].prediction
            users[5].prediction = !users[5].prediction
            console.log(users[0].user + " ---...--- " + users[5].user)
            console.log(user1 + " ---...--- " + user6)
            // users[0].predictionAmount = !users[0].predictionAmount
            // users[5].predictionAmount = !users[5].predictionAmount
            let user1pred = await prediction.makePrediction(
                marketId,
                users[0].prediction,
                { from: user1, value: users[0].predictionAmount }
            )
            let user6pred = await prediction.makePrediction(
                marketId,
                users[5].prediction,
                { from: user6, value: users[5].predictionAmount }
            )
            assert.equal("PredictionMade",user1pred.logs[0].event.toString())
            assert.equal("PredictionMade",user6pred.logs[0].event.toString())

        })
    })
})