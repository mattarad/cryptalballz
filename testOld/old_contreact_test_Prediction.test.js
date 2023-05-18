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
    let globalMax = 5000000000000000000
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

    describe('createPredictionMarket()', async () => {
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

        it('Allows admin to create a market', async () => {
            pred = await prediction.predictions(marketId)
            assert.equal(pred.predictionPhrase.toString(), phrase)
            assert.equal((pred.endBlock - pred.startBlock), time)
        })
        it('has an admin set as deployer', async () => {
            admin = await prediction.admin()
            assert.equal(admin, deployer)
        })
    })


    describe('makePrediction()', async () => {

        for(let i = 0; i < users.length; i++) {
            let randomInt = randomAmount()
            let predictionBool = returnBool()
            users[i].predictionAmount = randomInt
            users[i].prediction = predictionBool
        }
        let totalUsers = users.length
        let totalPredAmount = 0



        it('Should return correct user predictions', async () => {
            for(let i = 0; i < users.length; i++) {
                await prediction.makePrediction(marketId, users[i].prediction, { from: users[i].user, value: users[i].predictionAmount})
            }
            for(let i = 0; i < users.length; i++) {
                let { predictionAmount } =  await prediction.userPredictions(marketId, users[i].user)
                users[i].predictedAmount = predictionAmount
            }
            for(let i = 0; i < users.length; i++) {
                let predAmnt = users[i].predictedAmount.toString()
                predAmnt = parseInt(predAmnt)
                totalPredAmount += predAmnt
            }

            for(let i = 0; i < users.length; i++) {
                assert.equal(users[i].predictedAmount, users[i].predictionAmount)
            }
        })
        it('should return the correct total balance', async () => {
            let { totalBalance } = await prediction.predictions(marketId)
            totalBalance = totalBalance.toString()
            totalBalance = parseInt(totalBalance)
            assert.equal(totalBalance, totalPredAmount)
        })
        it('should return the correct total users', async () => {
            let { totalUserNumber } = await prediction.predictions(marketId)
            // console.log(totalUserNumber.toNumber())
            assert.equal(totalUserNumber.toNumber(), totalUsers)
        })
        it('has a market number', async () => {
            let marketnumber = await prediction.totalPredictionMarkets()
            assert.equal(marketnumber, marketId)
        })
    })

    describe('emergencyWithdraw()', async () => {
        for(let i = 0; i < users.length; i++) {
            let randomInt = randomAmount()
            let predictionBool = returnBool()
            users[i].predictionAmount = randomInt
            users[i].prediction = predictionBool
        }
        let totalUsers = users.length
        let totalPredAmount = 0
        phrase = 'this test 2'
        time = randomTime()
        before(async () => {
            await prediction.createPredictionMarket(phrase, time)
            currentActive++;
            marketId++
            
        })
        
        // let newPred = await prediction.createPredictionMarket("this is a test", 5000)
        // let makePrediction = await prediction.makePrediction(1, true, { from: user1, value: 5000000000000000000})
        it('has a market number', async () => {
            let marketnumber = await prediction.totalPredictionMarkets()
            assert.equal(marketnumber, marketId)
        })

        it('Checks the string and time of market', async () => {
            pred = await prediction.predictions(marketId)
            assert.equal(pred.predictionPhrase.toString(), phrase)
            assert.equal((pred.endBlock - pred.startBlock), time)
        })
        it('has an admin set as deployer', async () => {
            admin = await prediction.admin()
            assert.equal(admin, deployer)
        })


        it('Should return correct user predictions', async () => {
            for(let i = 0; i < users.length; i++) {
                await prediction.makePrediction(marketId, users[i].prediction, { from: users[i].user, value: users[i].predictionAmount})
            }
            for(let i = 0; i < users.length; i++) {
                let { predictionAmount } =  await prediction.userPredictions(marketId, users[i].user)
                users[i].predictedAmount = predictionAmount
            }
            for(let i = 0; i < users.length; i++) {
                let predAmnt = users[i].predictedAmount.toString()
                predAmnt = parseInt(predAmnt)
                totalPredAmount += predAmnt
            }

            for(let i = 0; i < users.length; i++) {
                assert.equal(users[i].predictedAmount, users[i].predictionAmount)
            }

        })

        it('should return the correct total balance', async () => {
            let { totalBalance } = await prediction.predictions(marketId)
            assert.equal(totalBalance.toString(), totalPredAmount)
        })
        it('should return the correct total users', async () => {
            let { totalUserNumber } = await prediction.predictions(marketId)
            assert.equal(totalUserNumber.toString(), totalUsers)
        })
        it('has a market number', async () => {
            let marketnumber = await prediction.totalPredictionMarkets()
            assert.equal(marketnumber, marketId)
        })

        it('has correct total number pre close', async () => {
            activeMarkets = await prediction.totalActivePredictionMarkets()
            closedMarkets = await prediction.totalClosedPredictionMarkets()
            settledMarkets = await prediction.totalSettledPredictionMarkets()
            emergencyMarkets = await prediction.totalEmergencyWithdrawPredictionMarkets()
            assert.equal(activeMarkets, currentActive)
            assert.equal(closedMarkets, currentClosed)
            assert.equal(settledMarkets, currentSettled)
            assert.equal(emergencyMarkets, currentEmergency)
        })

        it('has correct total number post close', async () => {
            
            await prediction.closePrediction(marketId)

            activeMarkets = await prediction.totalActivePredictionMarkets()
            closedMarkets = await prediction.totalClosedPredictionMarkets()
            settledMarkets = await prediction.totalSettledPredictionMarkets()
            emergencyMarkets = await prediction.totalEmergencyWithdrawPredictionMarkets()
            currentClosed++
            currentActive--
            assert.equal(activeMarkets, currentActive)
            assert.equal(closedMarkets, currentClosed)
            assert.equal(settledMarkets, currentSettled)
            assert.equal(emergencyMarkets, currentEmergency)
        })
        it('returns correct balances', async () => {

            for(let i = 0; i < users.length; i++) {
                let preBal = 0
                preBal = await web3.eth.getBalance(users[i].user)
                preBal = preBal.toString()
                preBal = parseInt(preBal)
                users[i].preBal = preBal
                let predictedBalance = 0
                predictedBalance = users[i].predictionAmount
                predictedBalance = predictedBalance.toString()
                predictedBalance = parseInt(predictedBalance)
                let combinedBal = 0
                combinedBal = preBal + predictedBalance
                users[i].combinedBal = combinedBal
            }


            await prediction.emergencyWithdrawal(marketId)
            currentClosed--
            currentEmergency++
            currentSettled++

            for(let i = 0; i < users.length; i++) {
                let postBal = 0
                postBal = await web3.eth.getBalance(users[i].user)
                postBal = postBal.toString()
                postBal = parseInt(postBal)
                users[i].postBal = postBal

                console.log(users[i].combinedBal)
                console.log(users[i].postBal)
                

            }
            for(let i = 0; i < users.length; i++) {
                assert.equal(users[i].combinedBal, users[i].postBal)
            }


        })
        it('check to ensure correct totals after emergency withdraw', async () => {
            activeMarkets = await prediction.totalActivePredictionMarkets()
            closedMarkets = await prediction.totalClosedPredictionMarkets()
            settledMarkets = await prediction.totalSettledPredictionMarkets()
            emergencyMarkets = await prediction.totalEmergencyWithdrawPredictionMarkets()

            assert.equal(activeMarkets, currentActive)
            assert.equal(closedMarkets, currentClosed)
            assert.equal(settledMarkets, currentSettled)
            assert.equal(emergencyMarkets, currentEmergency)
        })
    })


    describe('userWithdrawal()', async () => {
        before(async () => {
            phrase = 'this is the third test 3'
            time = randomTime()
            await prediction.createPredictionMarket(phrase, time)
            marketId++
            console.log(marketId)
            currentActive++;
        })
        // let userWithdrawADMINFee = await prediction.userWithdrawADMINFee()
        // let userWithdrawPOOLFee = await prediction.userWithdrawPOOLFee()
        // marketId++
        
        for(let i = 0; i < users.length; i++) {
            let randomInt = randomAmount()
            let predictionBool = returnBool()
            users[i].predictionAmount = randomInt
            users[i].prediction = predictionBool
        }
        let totalUsers = users.length
        let totalPredAmount = 0

        it('has a market number', async () => {
            let marketnumber = await prediction.totalPredictionMarkets()
            assert.equal(marketnumber, marketId)
        })


        it('Checks the string and time of market', async () => {
            pred = await prediction.predictions(marketId)
            assert.equal(pred.predictionPhrase.toString(), phrase)
            assert.equal((pred.endBlock - pred.startBlock), time)
        })
        it('has an admin set as deployer', async () => {
            admin = await prediction.admin()
            assert.equal(admin, deployer)
        })

        it('Should return correct user predictions', async () => {

            for(let i = 0; i < users.length; i++) {
                await prediction.makePrediction(marketId, users[i].prediction, { from: users[i].user, value: users[i].predictionAmount})
            }

            for(let i = 0; i < users.length; i++) {
                let { predictionAmount } = await prediction.userPredictions(marketId, users[i].user)
                users[i].predictedAmount = predictionAmount
            }
            for(let i = 0; i < users.length; i++) {
                let predAmnt = users[i].predictedAmount.toString()
                // predAmnt = parseInt(predAmnt)
                // totalPredAmount += predAmnt
                totalPredAmount += parseInt(predAmnt)
            }

            for(let i = 0; i < users.length; i++) {
                assert.equal(users[i].predictedAmount, users[i].predictionAmount)
            }
        })


        it('should return the correct total balance', async () => {
            let { totalBalance } = await prediction.predictions(marketId)
            totalBalance = totalBalance.toString()
            totalBalance = parseInt(totalBalance)
            assert.equal(totalBalance, totalPredAmount)
        })
        it('should return the correct total users', async () => {
            let { totalUserNumber } = await prediction.predictions(marketId)
            assert.equal(totalUserNumber.toNumber(), totalUsers)
        })
        it('has a market number', async () => {
            let marketnumber = await prediction.totalPredictionMarkets()
            assert.equal(marketnumber, marketId)
        })

        it('has correct total number pre close', async () => {
            activeMarkets = await prediction.totalActivePredictionMarkets()
            closedMarkets = await prediction.totalClosedPredictionMarkets()
            settledMarkets = await prediction.totalSettledPredictionMarkets()
            emergencyMarkets = await prediction.totalEmergencyWithdrawPredictionMarkets()
            assert.equal(activeMarkets, currentActive)
            assert.equal(closedMarkets, currentClosed)
            assert.equal(settledMarkets, currentSettled)
            assert.equal(emergencyMarkets, currentEmergency)
        })

        it('has correct total number post close', async () => {
            await prediction.closePrediction(marketId)
            activeMarkets = await prediction.totalActivePredictionMarkets()
            closedMarkets = await prediction.totalClosedPredictionMarkets()
            settledMarkets = await prediction.totalSettledPredictionMarkets()
            emergencyMarkets = await prediction.totalEmergencyWithdrawPredictionMarkets()
            currentClosed++
            currentActive--
            assert.equal(activeMarkets, currentActive)
            assert.equal(closedMarkets, currentClosed)
            assert.equal(settledMarkets, currentSettled)
            assert.equal(emergencyMarkets, currentEmergency)
        })
        it('returns correct balances', async () => {
            
            for(let i = 0; i < users.length; i++) {
                let preBal = await web3.eth.getBalance(users[i].user)
                preBal = preBal.toString()
                preBal = parseInt(preBal)
                users[i].preBal = preBal
                let predictedBalance = users[i].predictionAmount
                predictedBalance = predictedBalance.toString()
                predictedBalance = parseInt(predictedBalance)
                combinedBal = preBal + predictedBalance
                users[i].combinedBal = combinedBal
            }

            // for(let i = 0; i < users.length; i++) {
            //     let preBal = await web3.eth.getBalance(users[i].user)
            //     preBal = parseInt(preBal)
            //     users[i] = { preBal }
            //     let combinedBal = users[i].preBal + users[i].predictionAmount
            //     users[i] = { combinedBal }
            // }
            

            await prediction.emergencyWithdrawal(marketId)
            currentClosed--
            currentEmergency++
            currentSettled++


            // for(let i = 0; i < users.length; i++) {
                // let postBal = await web3.eth.getBalance(users[i].user)
                // postBal = parseInt(postBal)
                // users[i] = { postBal }
            // }
            // for(let i = 0; i < users.length; i++) {
                // assert.equal(users[i].postBal, users[i].combinedBal)
            // }

        })
        it('check to ensure correct totals after emergency withdraw', async () => {
            activeMarkets = await prediction.totalActivePredictionMarkets()
            closedMarkets = await prediction.totalClosedPredictionMarkets()
            settledMarkets = await prediction.totalSettledPredictionMarkets()
            emergencyMarkets = await prediction.totalEmergencyWithdrawPredictionMarkets()

            assert.equal(activeMarkets, currentActive)
            assert.equal(closedMarkets, currentClosed)
            assert.equal(settledMarkets, currentSettled)
            assert.equal(emergencyMarkets, currentEmergency)
        })
    })
})