import * as React from 'react'; 
import { setDocumentTitle } from '../../helpers'; 
import { Footer, HeaderLanding } from '../../containers';
 
export const CookiePolicy: React.FC = () =>  {
 
    React.useEffect(() => {
        setDocumentTitle('Cookie Policy')
     }, []);
    return (
        <div className="landing-screen">
            <HeaderLanding />
            <div className="landing-screen__features dark_mo">

                <div className="terms_wrapper__feees">

                    <h2>Cookie Policy</h2>
 
                    <div className="terms_wrapper__terms_text"> 
                    
                        <p>Like almost every other online service, our Services (including our website and app) use cookies and similar technologies to provide you with an enhanced user experience as well as allowing us to analyse and improve our Services. We would not be able to provide you with all of our Services, including certain personalised features, without the use of cookies and related technology and as such, your computer, mobile phone, tablet or other enabled mobile device (which we refer to collectively in this policy as a “device”) will need to be set up to enable such technologies.</p>
                        <p>By visiting and continuing to browse our website, downloading and using our app and using your account, including, where appropriate, with your browser settings adjusted to accept cookies, you are consenting to our use of cookies, web beacons and related technologies to provide our Services. If you do not consent to our use of cookies your only recourse is to stop using the Services and stop visiting our website. You are also free to disable cookies in your browser, but doing so may interfere with your use of our website or the Services. See Section 2 below for information on how to disable cookies.</p>
                        
                        <h3>1. What do we mean when we use the term ‘cookie’, ‘web beacon’ or ‘similar technology’?</h3>
                        <p>Cookies is a term used to describe a small text file (typically made of letters and numbers) that is downloaded and stored on your browser or your device by websites that you visit. They are sometimes considered as forming part of the “memory” of your use of websites and related services as they allow service providers to remember you and respond appropriately.</p>
                        <p>Cookies are typically split into 2 main types, namely:</p>
                        <ul>
                        <li>Session cookies. Session cookies are stored in your device’s memory only for the length of time of your browsing session. For example, session cookies allow you to move around our website and your account features without having to repeatedly log in. They are not accessible after your browser session may have been inactive for a period of time and are deleted from your device when your browser is closed down.</li>
                        <li>Persistent cookies. Persistent cookies are stored in your devices’ memory and are not deleted when your browser is closed. Persistent cookies can helpfully remember you and your preferences each time you access our Services.</li>
                        </ul>
                        <p>We use both of these types of cookies.</p>
                        <p>Cookies can also be further categorized as follows:</p>
                        <ul>
                        <li><b>Strictly necessary cookies.</b> These are cookies that are required for the necessary operation of our services. They include, for example, cookies that enable you to log into secure areas of our website and/or app;</li>
                        <li><b>Performance cookies.</b> They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily;</li>
                        <li><b>Functionality cookies.</b> These are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name and remember your preferences (for example, your choice of language or region);</li>
                        <li><b>Targeting cookies.</b> These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests. We may also share this information with third parties for this purpose;</li>
                        <li><b>Web beacons.</b> The term ‘web beacon’ is used to describe an object embedded in a web page or email. This object is typically invisible to you, but it permits us to confirm whether you have viewed the web page and/or email (as the case may be). There are other names for ‘web beacons’ which you may come across – these include web bug, tracking bug, clear gif and pixel tag.</li>
                        </ul>
                        
                        <h3>2. Managing Cookies</h3>
                        <p>You can manage your cookies (including the enabling or disabling of cookies) by using your browser. For example, you block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including cookies that are strictly necessary) you may not be able to access all or parts of our Services.</p>
                        <p>Each browser is different and as such we suggest that you check the ‘Help’ menu on your particular browser (or your mobile phone’s handset manual) to learn how to change your cookie preference. You may also find more information on how to manage your cookies from third party websites.</p>
                        <p>Here are some links to popular browser cookie information pages which you might find helpful to assist in your cookie management:</p>
                        <ul>
                        <li><a href="https://support.apple.com/en-gb/HT201265" target="_blank" rel="noopener noreferrer">Safari</a>;</li>
                        <li><a href="https://support.google.com/chrome/answer/95647?hl=en&ref_topic=3434352" target="_blank" rel="noopener noreferrer">Google Chrome</a>;</li>
                        <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a>.</li>
                        </ul>
                        
                        <h3>3. General</h3>
                        <p>We hope the above has clearly explained how we use cookies and similar technologies as well as how you can manage such matters. While we have provided details of third party websites and services which we thought you may find useful, please note that we are not responsible for the content, functionality or services provided by such sites. If you have any further questions or comments about our use of cookies, please contact Support.</p>
                        
                    </div>

                </div> 
                     
            </div> 
            <Footer />
        </div> 
    );
 
} 