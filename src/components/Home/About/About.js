import React from 'react';


import './About.css'




const About = () => {

    return (
        <>
        <div className='about-container'> <h5> ABOUT </h5></div>
        <div className='about-container'>
            <div>
                Cryptal Ballz is a peer-to-peer prediction market deployed to the GOERLI Testnet. In order for the Predicitons Page to load, you will need to be connected to Goerli through your browser's wallet. Predictors can finally put their money where their mouth is when making a prediction.
                We create the markets, you place your predictions by either saying yes it will happen or no it won't happen (yes or no).
                
                <br></br>
                When we settle a prediction, the smart contract will take the amount you deposited and give each winner a weighted average of the total 
                deposits made on the given prediction market.
                <br></br>
                <p></p>

                <p>
                    Example: If you deposit 1 ETH for the prediction to settle as YES, and other people have joined you bringing the total pooled YES balance to 
                    10 ETH. While On the NO side, lets say there is a total NO pool equaling 100 ETH. Since you put in 1/10 ETH of the YES pool, equaling a 0.1 weight of the pool (0.1 out of 1),
                    you will have claim to 0.1 of the total pool if it settles in your favor. If it settles in your favor, you would get a weighted average of 0.1
                    of the pool of 110 ETH. So you would recieve 11 ETH!
                <p></p>

                    <p>
                        Yes Pool Balance: 10 ETH
                    </p>
                    <p>
                        the weight of the pool you own: 0.1/1
                    </p>
                    <p>
                        No Pool Balance: 100 ETH
                    </p>
                    <p>
                        Total Pool Balance: 110 ETH
                    </p>
                </p>
            </div>
        </div>
        </>
    )
}

export default About
