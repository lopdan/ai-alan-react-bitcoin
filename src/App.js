import React, { useEffect } from 'react';
import alanButton from '@alan-ai/alan-sdk-web';

import InfoBox from './components/InfoBox';

const alan_SDK_key = 'c1344b0e5cda4dfcd27bc949d44adcca2e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {

    useEffect(() => {
        alanButton({
            key: alan_SDK_key,
            onCommand: ({ command }) => {
                if(command === 'testCommand'){
                    alert('Test succesful');
                }
            }
        })
    }, [])
    
    return(
        <div>
            <h1>Initial structure</h1>
        </div>
    );

}

export default App;