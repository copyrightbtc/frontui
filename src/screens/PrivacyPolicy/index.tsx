import * as React from 'react'; 
import { setDocumentTitle } from '../../helpers'; 
import { Footer, HeaderLanding } from '../../containers';
import { selectMobileDeviceState } from '../../modules';
import { useReduxSelector } from '../../hooks';

export const PrivacyPolicy: React.FC = () =>  {

    React.useEffect(() => {
        setDocumentTitle('Privacy Policy')
     }, []);
    const isMobileDevice = useReduxSelector(selectMobileDeviceState);
    return (
        <div className="landing-screen">
            {!isMobileDevice && <HeaderLanding />}
            <div className="landing-screen__features dark_mo">

                <div className="terms_wrapper__feees">

                    <h2>Privacy Policy</h2>
 
                    <div className="terms_wrapper__terms_text"> 
                        <p>This Privacy Policy is provided in a layered format so you can click through to the specific areas set out below.</p>
    
                        <h3>1. Important information and who we are</h3>
                        <h4>Data controller</h4>
                        <p>This Privacy Policy, as amended or otherwise changed from time to time (the “Privacy Policy”), explains the manner in which Cyber Security Group LLC (“SFOR.TRADE”, "we", "us", "our") collects, uses, maintains and discloses user information obtained through the SFOR.TRADE website (the “Site”). SFOR.TRADE is the data controller of your Personal Data.</p>
                        <p>We have also appointed a data protection officer ("DPO") who is responsible for overseeing questions in relation to this Privacy Policy. If you have any questions about the Privacy Policy, including requests to exercise your rights, please contact us. We will address your request within 30 business days.</p>
                        <h4>Changes to this Privacy Policy</h4>
                        <p>By using the Site, you ("User") consent to the data practices prescribed in this Privacy Policy. On occasion, SFOR.TRADE may revise the Privacy Policy. On occasion, SFOR.TRADE may revise this Privacy Policy to reflect changes in law, our personal data collection and use practices, the features on the Site, or advances in technology. If material changes are made to this Privacy Policy, the changes will be prominently posted on the Site.</p>
                        <p>Please note: This Privacy Policy does not cover any information that we may receive about you through channels external to SFOR.TRADE.</p>
                        
                        <h3>2. What information does SFOR.TRADE collect?</h3>
                        <p>We collect Personal Data and Anonymous Data, as described below.</p>
                        <p>“Personal Data”: means data that allows someone to identify or contact you, including, for example, your name, address, telephone number, e-mail address, as well as any other non-public information about you that is associated with or linked to any of the foregoing data.</p>
                        <p>“Anonymous Data”: means data that is not associated with or linked to your Personal Data; Anonymous Data does not, by itself, permit the identification of individual persons.</p>
                        <p>We may collect Personal Data from you, such as your first and last name, e-mail and mailing addresses, date of birth, government issued identification, photographs, biometric information (including but not limited to device fingerprinting), company name, and password when you use our Site.</p>
                        <p>We may also collect other Personal Data provided by third party identity verification services or via social networking websites.</p>
                        <p>If you tell us where you are (e.g., by allowing your mobile device or computer to send us your location), we may store that information.</p>
                        <p>Certain services, such as two-factor authentication, may require our collection of your phone number. We may associate that phone number to your mobile device identification information.</p>
                        <p>If you provide us feedback or contact us via e-mail, we will collect your name and e-mail address, as well as any other content included in the e-mail, in order to send you a reply.</p>
                        <p>We also collect other types of Personal Data that you provide to us voluntarily when seeking support services, such as email, information submitted via online form, video conferencing service information, other contact information, or other information provided to support services staff.</p>
                        <p>We may collect other data, including but not limited to, referral URLs, your location, blockchain analytics information related to blockchain addresses you provide.</p>
                        <p>Some information is collected automatically by our servers:</p>
                        <ul>
                        <li>Our servers (which may be hosted by a third party service provider) collect information from you, including your browser type, operating system, Internet Protocol (“IP”) address (a number that is automatically assigned to your computer when you use the Internet, which may vary from session to session), domain name, and/or a date/time stamp for your visit.</li>
                        <li>As is true of most websites, we gather certain information automatically and store it in log files. This information includes IP addresses, browser type, Internet service provider (“ISP”), referring/exit pages, operating system, date/time stamp, and clickstream data.</li>
                        <li>Like many online services, we use cookies to collect information. “Cookies” are small pieces of information that a website sends to your computer’s hard drive while you are viewing the website.</li>
                        <li>We retain information on your behalf, such as transactional data and other session data linked to your Account.</li>
                        </ul>
                        <h4>Information about criminal convictions</h4>
                        <p>When you register for or otherwise use our Services, we may receive information about your criminal convictions when we perform certain verification or compliance checks. We carry out these checks in order to detect or prevent any unlawful or fraudulent acts and to comply with our legal obligations.</p>
                        <h4>If you fail to provide Personal Data</h4>
                        <p>Where we need to collect personal data by law, or under the terms of a contract we have with you and you fail to provide that data when requested, we may not be able to perform the contract we have or are trying to enter with you. In this case, we may have to close your Account but we will notify you if this is the case at the time.</p>
                        
                        <h3>3. How does SFOR.TRADE use the information it collects?</h3>
                        <p>We will only use your Personal Data when the law allows us to. Most commonly, we will use your Personal Data in the following circumstances:</p>
                        <ul>
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you;</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests; and/or</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                        <p>Please note: We may process your personal data without your knowledge or consent where this is required or permitted by law.</p>
                        <p>In general, Personal Data you submit to us is used either to respond to requests that you make, or to aid us in serving you better. We use your Personal Data in the following ways:</p>
                        <ul>
                        <li>facilitate the creation of and secure your Account on our network;</li>
                        <li>identify you and perform identity verification through a service provider;</li>
                        <li>provide improved administration of our Site and Services;</li>
                        <li>improve the quality of experience when you interact with our Site and Services;</li>
                        <li>send you a welcome email to verify ownership of the e-mail address provided when your Account was created;</li>
                        <li>send you administrative e-mail notifications, such as account activity, transaction processing, security or support and maintenance advisories;</li>
                        <li>identify, prevent, and report potentially suspicious, fraudulent, or illegal activities;</li>
                        <li>notify you about important changes to our Terms; and</li>
                        <li>respond to your inquiries related to employment opportunities or other requests.</li>
                        </ul>
                        <p>All data collected automatically will be used to administer or improve our services.</p>
                        <p>We use IP addresses to make our Site and Services more useful to you, and to perform identity verification.</p>
                        <p>We use information from log files to analyze trends, administer the Site, track users’ movements around the Site, gather demographic information about our user base as a whole, and better tailor our Services to our users’ needs. Except as noted in this Privacy Policy, we do not link this automatically-collected data to Personal Data.</p>
                        <p>We use NetVerify by Jumio (“Jumio”) to verify your identity by determining whether a selfie you take matches the photo in your form of identification. NetVerify’s facial recognition technology collects information from your photos that may include biometric data, and it shares this information with us. We use that information to verify your ID. We will store your biometric data for as long as is necessary to perform the services and comply with applicable law. By using the SFOR.TRADE services, you agree Jumio may collect your biometric data from the photos you submit to perform ID verification and that Jumio may share that information with us.</p>
                        <p>We may use both session Cookies (which expire once you close your web browser) and persistent Cookies (which stay on your computer until you delete them) to provide you with a more personal and interactive experience on our Site. This type of information is collected to make the Site more useful to you and to tailor the experience with us to meet your special interests and needs.</p>
                        <p>We may create Anonymous Data records from Personal Data by excluding information (such as your name) that makes the data personally identifiable to you. We use this Anonymous Data to analyze request and usage patterns so that we may enhance the content of our Services and improve Site navigation. We reserve the right to use Anonymous Data and aggregated and other de-identified information for any purpose and disclose Anonymous Data to third parties in our sole discretion.</p>
                        <p>SFOR.TRADE does not sell user data to any third party.</p>
                        <h4>Marketing</h4>
                        <p>We provide you with choices regarding certain Personal Data that SFOR.TRADE uses, particularly around marketing and advertising. We have established the following personal data control mechanisms:</p>
                        <ul>
                        <li>(i) Promotional offers from us</li>
                        <li>We may use your Personal Data to determine what may be of interest to you. This is how we decide which products, services, and offers may be relevant for you. By using our Services or requesting information from us, you opt-in to receive marketing communications.(ii) Third-party marketing</li>
                        <li>We will obtain your express consent (opt-in) before we share your Personal Data with any company outside of the SFOR.TRADE for that company's own marketing purposes.(iii) Opting out</li>
                        </ul>
                        <p>You can ask us or third parties to stop sending you marketing messages at any time by following the opt-out links on any marketing message sent to you or by contacting us.</p>
                        
                        <h3>4. Purpose for which SFOR.TRADE will use your data and on what legal basis</h3>
                        <p>We process the aforementioned data in compliance with the applicable legislation as amended from time to time in order to be able to perform our contractual obligations towards the Client and offer them the best possible service, provide our Services efficiently, comply with our legal and regulatory obligations, including, inter alia, to prevent fraud and money laundering acts and/ or conduct the assessment of suitability and appropriateness test, and protect our legitimate interests and your vital interests.</p>
                        <p>We disclose your Personal Data as described below and as described elsewhere in this Privacy Policy:</p>
                        <ul>
                        <li>It may be necessary to disclose your information to law enforcement agencies, regulators, government/public officials, or other relevant third parties to comply with any law, subpoenas, court orders, or government request, defend against claims, investigate or bring legal action against illegal or suspected illegal activities, enforce our Terms, or to protect the rights, safety, and security of SFOR.TRADE, our users, or the public;</li>
                        <li>We may share your Personal Data with third party service providers to provide you with the Services that we offer you through our Site; to conduct quality assurance testing; to facilitate creation of accounts; to provide technical support; to verify your identity; and/or to provide other services to the Company. These third party service providers are required not to use your Personal Data other than to provide the services requested by us;</li>
                        <li>We may share some or all of your Personal Data with third parties (e.g. the purchaser or new owner) in connection with or during negotiation of any merger, financing, acquisition or dissolution transaction or proceeding involving sale, transfer, divestiture, or disclosure of all or a portion of our business or assets. In the event of an insolvency, bankruptcy, or receivership, Personal Data may also be transferred as a business asset. If another company acquires our company, business, or assets, that company will possess the Personal Data collected by us and will assume the rights and obligations regarding your Personal Data as described in this Privacy Policy.</li>
                        </ul>
                        <p>If you are an existing Client of the Website where we have a legitimate interest in communicating with you, or if you have given us your consent we will collect and process your personal data to communicate with you in case of support and/or sending newsletters, push-messages and calls to keep you in touch with our new features, news and events and the efficient provision of the full scope of our services.</p>
                        <p>Our Website is not intended for children and we do not knowingly collect data relating to children. As we do not allow users under the age of 18 to use our services, we need to obtain your birth date in order to confirm the Clients’ age checks.</p>
                        <p>SFOR.TRADE may contain links to other third party websites which are regulated by their own privacy policies. SFOR.TRADE is not responsible for the privacy policies of these third party websites even if they were accessed using the links from our Site.</p>
                        <p>Other than as stated in this Privacy Policy, SFOR.TRADE does not disclose any of your personal information to third parties unless required to do so by law enforcement, court order, or in compliance with legal reporting obligations.</p>
                        
                        <h3>5. How can you update your information?</h3>
                        <p>You can update your information by contacting support and making a request.</p>
                        <p>We will retain your information for as long as your Account has not been closed or as needed to provide you access to your Account. If you wish to close your Account, open a ticket with our support center. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our Terms.</p>
                        
                        <h3>6. How does SFOR.TRADE use cookies and persistent local data?</h3>
                        <p>We collect web browser Information in order to enhance your experience on our Site and track how the Services are being used. Cookies are small data files that are stored on your computer’s hard drive, and in addition to using cookies to provide you with a better user experience, we use cookies to identify and prevent fraudulent activity. The information collected can include, but is not limited to, your IP address, referral URLs, the type of device you use, your operating system, the type of browser you use, geographic location, and other session data. Cookies are not permanent and will expire after a short time period of inactivity. You may opt to deactivate your cookies, but it is important to note that you may not be able to access or use some features of our site. Please note that SFOR.TRADE is not responsible or can be held liable for any loss resulting from your decision or inability to use such features. For more information about the cookies we use, please see our Cookie Policy.</p>
                        <p>Do Not Track ("DNT") is an optional browser setting that allows you to express your preferences regarding tracking by advertisers and other third-parties. At this time, we do not respond to DNT signals.</p>
                        
                        <h3>7. What security precautions does SFOR.TRADE take to protect me?</h3>
                        <p>We take the protection of your personal information seriously. We use industry-standard data encryption technology and have implemented restrictions related to the storage of and the ability to access your personal information.</p>
                        <p>Please note that no transmission over the Internet or method of electronic storage can be guaranteed to be 100% secure.</p>
                        
                        <h3>8. Your legal rights</h3>
                        <p>Under certain circumstances, you have rights under data protection laws in relation to your Personal Data which are set out in more detail below:</p>
                        <ul>
                        <li><b>Request access.</b> This enables you to receive a copy of the Personal Data we hold about you and to check that we are lawfully processing it. This is also commonly known as a "data subject access request".</li>
                        <li><b>Request correction.</b> This enables you to have any incomplete or inaccurate data we hold about you corrected, though we may need to verify the accuracy of the new data you provide to us. If you need to add or change any information, you can log into your Account and make the change in your settings. If it doesn't look like you can make the change on your own, please reach out to us via the Support Center and we'll take care of it.</li>
                        <li><b>Request deletion.</b>This enables you to ask us to delete or remove Personal Data where there is no good reason for us continuing to process it. You also have the right to ask us to delete or remove your Personal Data where you have successfully exercised your right to object to processing (see below), where we may have processed your information unlawfully or where we are required to erase your Personal Data to comply with applicable law. Please note:your right of deletion would not apply for various reasons including if we need to retain your Personal Data in order to comply with a legal obligation or to establish or defend a legal claim. Where we are unable to comply with your request of deletion, we will notify you at the time of your request.</li>
                        <li><b>Object to processing.</b> You have the right to object to the processing of your Personal Data where we are relying on a legitimate interest (or those of a third party) and there is something about your particular situation which makes you want to object to processing on this ground as you feel it impacts on your fundamental rights and freedoms. You also have the right to object where we are processing your Personal Data for direct marketing purposes. In some cases, we may demonstrate that we have compelling legitimate grounds to process your information which override your rights and freedoms.</li>
                        <li><b>Request restriction of processing.</b> This enables you to ask us to suspend the processing of your Personal Data in the following scenarios:
                        <ol>
                        <li>(a) if you want us to establish the data's accuracy;</li>
                        <li>(b) where our use of the data is unlawful but you do not want us to delete it;</li>
                        <li>(c) where you need us to hold the data even if we no longer require it as you need it to establish, exercise or defend legal claims; or</li>
                        <li>(d) you have objected to our use of your data but we need to verify whether we have overriding legitimate grounds to use it.</li></ol></li>
                        <li><b>Request to transfer.</b> If you ask us, we will provide you or a third party you have chosen, your Personal Data in a structured, commonly used, machine-readable format. Note that this right only applies to automated information which you initially provided consent for us to use or where we used the information to perform a contract with you.</li>
                        <li><b>Withdrawal of consent.</b> This applies where we are relying on consent to process your Personal Data. However, this will not affect the lawfulness of any processing carried out before you withdraw your consent. If you withdraw your consent, we may not be able to provide certain products or services to you. We will advise you if this is the case at the time you withdraw your consent.</li>
                        </ul>
                        <p>If you wish to exercise any of the rights set out above, please contact us.</p>
                        <h4>No fee usually required</h4>
                        <p>You will not have to pay a fee to access your Personal Data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive or excessive. Alternatively, we may refuse to comply with your request in these circumstances.</p>
                        <h4>What we may need from you</h4>
                        <p>We may need to request specific information from you to help us confirm your identity and ensure your rights to access your Personal Data (or to exercise any of your other rights). This is a security measure to ensure that Personal Data is not disclosed to any person who has no right to receive it. We may also contact you to ask you for further information in relation to your request to speed up our response.</p>
                        <h4>Time limit to respond</h4>
                        <p>We try to respond to all legitimate requests within one month. Occasionally it may take us longer than a month if your request is particularly complex or you have made a number of requests. In this case, we will notify you and keep you updated.</p>
                        
                        <h3>9. Children's privacy</h3>
                        <p>Unfortunately, if you're under 18, you can't use our Services. We do not knowingly solicit or collect information from anyone under 18. If we become aware that a person under the age of 18 has provided us with personal information, we'll delete it immediately.</p>
                        
                        <h3>10. Contacting Us</h3>
                        <p>If you have any questions about our Privacy Policy as outlined above, please contact us through our support center.</p>
                                            
                         
                    </div>

                </div> 
                     
            </div> 
        <Footer />
        </div> 
    );
}
 