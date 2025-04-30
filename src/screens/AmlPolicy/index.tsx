import * as React from 'react'; 
import { setDocumentTitle } from '../../helpers'; 
import { Footer, HeaderLanding } from '../../containers';
import { selectMobileDeviceState } from '../../modules';
import { useReduxSelector } from '../../hooks';

export const AmlPolicy: React.FC = () =>  {

    React.useEffect(() => {
        setDocumentTitle('AML/CFT & KYC')
     }, []);
    const isMobileDevice = useReduxSelector(selectMobileDeviceState);
    return (
        <div className="landing-screen">
            {!isMobileDevice && <HeaderLanding />}
            <div className="landing-screen__features dark_mo">

                <div className="terms_wrapper__feees">

                    <h2>AML/CFT & KYC Policy</h2>

                    <div className="terms_wrapper__terms_text">
 
                    <h3>1. Introduction</h3>
                    <p>Cyber Security Group LLC (hereinafter “SFOR company”) is a SFOR company and its main goal and mission is to make available the fastest connection to the world markets, such as securities exchange markets, currency exchange markets and cryptocurrency markets. In the SFOR company, the greatest value is the most profound liquidity at the time of trade and fast communication with currency markets.</p>
                    <p>For the purpose of ensuring the highest standards of services offered and full providing of the requirements of the Georgian Legislation, the SFOR company has developed the Policy “Anti Money Laundering Control” (hereinafter referred to as “policy”), which is based on the Georgian law “On Facilitating the Prevention of Illicit Income Legalization”, provision of the Financial Monitoring Service of Georgian “Regulation on Receiving, Systemizing and Processing the Information by the SFOR company and Forwarding to the Financial Monitoring Service of Georgia”, Order “On the approval of additional regulating rule of the brokerage companies involved in trading of financial instruments containing high risks” and the recommendations of Financial Actions Task Force (FATF). The goal of the policy is to develop anti-money laundering and anti-terrorism funding system for the SFOR company, risk identification, analyzing, management and reduction.</p>
                    <h3>2. Definition of terms</h3>
                    <p>Money Laundering - to convert illicit income into legal (purchase, use, transfer or other action), as well as concealing or disguising of thrue origin, proprietor or owner and/or property rights and/or attempt to commit such acts.</p>
                    <p>Terrorism Funding - anyoperation (regardless the amount of money) performed by any person illegally and intentionally, directly or indirectly, by any means, whose goal is to find and collect funds for the purpose or based on the information that this amount is used, partially or fully, for preparation or conduct of terrorism act. In some cases, it may be extended to the sources obtained legally.</p>
                    <p>Illicit Income - illegal and/or unjustified income of person/company.</p>
                    <p>Property - all the items (both movable and immovable) and intangible property benefits that can be owned, used and managed by individuals and legal entities.</p>
                    <p>Identification - obtaining information about the client that follows to search and distinguish a person between the others.</p>
                    <p>Client/Customer - any person applying to the SFOR company for the service envisaged by the Georgian legislation and/oe enjoys the above mentioned services.</p>
                    <p>Beneficial Owner - a natural person who ultimately owns or controls a person/company and/or the natural person on whose behalf a transaction is being conducted. Beneficial owner of an entrepreneurial legal entity (as well as of the organizational formation provided by the Georgian legislation, which is not a legal entity) is a natural person who ultimately owns or control, direct or indirect, 25% or more of his shares or voting rights or a natural person who otherwise executes control over the entrepreneurial legal entity.</p>
                    <p>Control - to exercise a strong influence, directly or indirectly, alone or together with others, by using voting shares or by other ways.</p>
                    <p>Controlling person - a person who exercises control.</p>
                    <p>Business relationship - a continuous or regular business, commercial or professional relationship between the SFOR company and the client and implies providing brokerage services indicated in the first article by the SFOR company to the client.</p>
                    <p>Politically exposed person - a person holding a state (public) political position and/or executes important state and political activities according to the legislation of the government and their deputies, head of the state institutions, member of parliament, member of the superior court, member of the constitutional court, head and member of the military forces, member of the border of the central (national) bank/financial supervision agency, ambassador, head of the enterprise operating by the partial participation of the State, head of the political party (union), member of the executive body of the political party (union), other political figures, as well as their family members and a person in the direct business relationship with them: a person is still considered politically exposed during a year leaving the above-mentioned position.</p>
                    <p>Suspicious transaction - a deal (regardless of its amount and type of the operation, on which there is a reasonable suspicion that it has been concluded or implemented for the purpose of legalization of illicit income and/or property (including cash fund) on which the transaction was concluded or executed, it has been obtained or derived through criminal activity and/or the transaction was concluded or executed for the purpose of funding terrorism (the suspicion is on the person involved in the transaction or the origin of the transaction or there is another reason for which the transaction may be considered suspicious), or any of its participants is included in the list of terrorists or person supporting terrorism and/or may be associated with them and/or money funds involved in it may be related or used for terrorism, terrorist act or by terrorists or terrorist organization or by a person sponsored terrorism or that any of its participant’s legal or real address or place of residence is in non-cooperative (non-cooperating) zone or that the transaction of his amount is done in/from such zone.</p>
                    <p>Unusual transaction - complex unusually large transaction and a type of transaction with no clear economic (commercial) content or legal purpose, does not correspond to the usual activity of the person involved in the transaction.</p>
                    <p>Transaction partitioning - according to this policy it implies a combination of transactions performed by/for one person in a certain period of time, whose total amount exceeds 30,000 GEL or its equivalent in another currency and there is a reasonable suspicion that they were partitioned deliberately to avoid reporting about the transaction. The basis for reasoning of suspicion is analysis conducted by the AML officer.</p>
                    <p>AML Officer - an employee appointed on the basis of property signed by the company, who is responsible for the coordinating of money laundering in the SFOR company.</p>
                    <h3>3. Internal control system</h3>
                    <p>The SFOR company provides the creation of an effective internal control system against money laundering and terrorism funding, which consists of the following components:</p>
                    <ul>
                    <li>Internal policy and procedures;</li>
                    <li>Employees responsible for control;</li>
                    <li>Risk-based approach;</li>
                    <li>Obligation of the SFOR company regarding data bookkeeping;</li>
                    <li>Obligation of the SFOR company regarding information storage;</li>
                    <li>Reporting;</li>
                    <li>Suspension of the execution of transaction on the basis of the request of Financial Monitoring Service of Georgia;</li>
                    <li>Recruitment and training;</li>
                    <li>Adding a new product to the SFOR company.</li>
                    </ul>
                    
                    <h3>4. Internal policy and procedures</h3>
                    <p>The SFOR company performs internal control on the basis of “Money laundering and terrorist funding prevention policy”. The policy defines the basic principles, responsibilities and control mechanisms for prevention of money laundering and terrorism funding.</p>
                    <p>This policy defines the criteria of risk assignment for clients and products of the SFOR company and risk relevant measures for identification and verification of the clients.</p>
                    <p>This policy is available for all employees of the organization.</p>
                    
                    <h3>5. Employees responsible for control</h3>
                    <p>The director of the SFOR company appoints an employee responsible for money laundering control - AML officer, on the basis of the signed order/decision. The main functions and obligations of the aforesaid officer are as follows:</p>
                    <ul>
                    <li>Internal control implementation for the prevention of illicit income legalization and terrorism funding;</li>
                    <li>Development of internal instruction (internal control rules) and taking appropriate measures for the purpose of its execution;</li>
                    <li>Systematization of the information about transactions subjected to the monitoring, which implies development of data accounting system and ensuring its execution;</li>
                    <li>Monitoring of clients’ identification process and the transactions carried out by them;</li>
                    <li>Preparation and sending reports on transactions/deals subjected to monitoring to the Financial Monitoring Service of Georgia;</li>
                    <li>Preparation and sending of supervision report of National Bank of Georgia;</li>
                    <li>Process coordination during on-site inspection performed by supervision service of National Bank of Georgia;</li>
                    <li>Providing information on money laundering issues for the directors of SFOR company;</li>
                    <li>Organizing periodic trainings Control implementation on the performance of the instructions on suspension of the transaction execution made by financial monitoring service of Georgia;</li>
                    <li>Performing any other function related to the prevention of money laundering procedures in the SFOR company;</li>
                    <li>AML officer is given absolute authority to obtain any information and documents necessary for the performance of these functions during executing his obligations.</li>
                    </ul>
                    <p>In order to fulfill the above mentioned function, the SFOR company made accessible for specially assigned employees - AML officers, all the necessary resources, including appropriate technical and software tools, with reliable means of storage of documents and information, etc.</p>
                    <p>AML officer is accountable only to the director of the SFOR company in relation to the execution of the functions imposed directly to him and the matters related to the implementation of the monitoring.</p>
                    <p>The director of the SFOR company, together with an AML officer, is obliged to ensure the effectiveness of the money laundering control system, as well as to implement separate control mechanisms and the obligation of its execution is also his responsibility.</p>
                    <h3>6. Risk-based approach</h3>
                    <p>For the implementation of money laundering control, the SFOR company has developed a risk-based approach, which means that the SFOR company divides its own products and also its clients into low, medium and high risk categories. The basis for risk determining is identification and assessment of relevant risk-factors by the SFOR company for money laundering and terrorism funding.</p>
                    <p>The purpose of identification and assessment of risk factors is to determine control mechanisms for medium and high risk category products and clients, on the basis of which it will be possible to reduce and manage of money laundering and terrorism funding risks facing to the SFOR company.</p>
                    <p>When assessing a specific client, it uses a specific, risk-based approach and assigns them into different categories. The SFOR company is obliged to group clients in low, medium and high risk groups.</p>
                    <p>Some of the basis criteria of risk assessment are:</p>
                    <ul>
                    <li><b>Risk of activity.</b> The product risk assessment is done individually by the SFOR company, considering the client’s personality and the business relationship with him. If the client’s main goal is in the Annex 2, it is assigned to the relevant risk category according to the criterion.</li>
                    <li><b>Product and service risk.</b> This category refers to the client and product and services used by him. If the client uses the products listed in Annex 1, he is assigned to the product relevant risk category according to the criterion.</li>
                    <li><b>Politically exposed person.</b> In case of the person’s political status, which is defined in Article 2 of the policy, he automatically represents a high risk category. This applies to both the client and the beneficiary owner. If the client or his beneficiary owner has been given a status of politically exposed person after establishing business relations with the person implementing monitoring, they automatically fall into the high risk category.  The director of the SFOR company issues a special consent about establishment of business relations with a politically exposed person, which is specified in Annex 7.</li>
                    <li><b>Client risk.</b> The risk category is assigned to the client at the moment of establishing a business relationship, and the initial risk category is revised in case of revealing new circumstances during the permanent monitoring process of business relationship. Client classification in terms of the assigned risk is carried out in 3 levels: low, medium and high; the systematization of the information takes place only after this, however, the classification may be changed in certain circumstances, which is specified in Annex 3. The client risk includes such types of activities of natural and legal persons, peculiarities of the implemented operations and behavior, as well as other features, which can put the client in a high risk category. The clients of the category are specified in Annex 4. While assigning a risk category to the client or beneficiary owner, it is important to consider several factors: type of client or beneficiary owner, his location (place of registration), field of activity and geographical area, character and intensity of business relationship, type and volume of product/service or transaction (operation). Whereas, the client meets some high risk criterion specified in article 6, it is automatically granted a high risk category. Whereas, the client meets some medium risk criterion specified in article 6, it is automatically granted a medium risk category. And whereas, the client meets some low risk criterion specified in article 6, it is automatically granted a low risk category.</li>
                    </ul>

                    <p>The high risk clients monitoring is carried out once in 6 months, while clients with medium risk are revised once a year.</p>
                    
                    <h3>7. Obligation of the SFOR company regarding data bookkeeping</h3>
                    <p>The SFOR company registers the documents drawn up with clients:</p>
                    <ul>
                    <li>Type of transaction concluded;</li>
                    <li>Form of transaction (written or oral);</li>
                    <li>Subject of securities transaction (full name of the issuer, class of securities, quantity);</li>
                    <li>The goal of the transaction;</li>
                    <li>Cost and currency of transaction;</li>
                    <li>Date of signature of transaction, execution starting and finishing date, country, city the transaction was concluded;</li>
                    <li>Date (or name and surname) of the registering body of the transaction, address(legal, real), date and number of registration (in case of a transaction registration).</li>
                    </ul>
                    <p>The SFOR company, due to the transactions concluded with the client, registers the following information about the transaction carried out on securities by the SFOR company (by the client’s order):</p>
                    <ul>
                    <li>Type of transaction performed in accordance with the legislation about securities;</li>
                    <li>Form of transaction;</li>
                    <li>Subject of securities transaction (full name of the issuer, class of securities, quantity);</li>
                    <li>Date of execution of the transaction;</li>
                    <li>Cost and currency of the transaction;</li>
                    <li>Name (or name and surname) of registering body of the transaction, address (legal, real), date and number of registration (in case of a transaction registration);</li>
                    <li>Identification data of all the persons participating in the transaction, including:</li>
                    <ol>
                        <li>Identification information of the persons whose behalf the transaction is carried out by the SFOR company, namely the type, number and date of opening of the bank account, which is used for the specific transaction.</li>
                        <li>Information about the other party of the transaction, its identification data and bank details.</li>
                        <li>Identification data of the person acting under the client’s order of the SFOR company (representative, attorney), as well as the content of the relevant attorney or proxy, its issuing body, date of issue and the validity period, certifying person (notary) of attorney or proxy, date and place of certification.</li>
                    </ol>
                    <li>Unique number of the client;</li>
                    <li>Account number of the client;</li>
                    <li>Credit side given to the client;</li>
                    <li>The amount of money deposited by the client and the date of it;</li>
                    <li>The withdrawal amount by the client and the date of it;</li>
                    <li>The total outcome of trade for closed transactions;</li>
                    <li>Current (unrealized) profit/loss for open positions;</li>
                    <li>Initial margin used in open positions;</li>
                    <li>Free margin;</li>
                    <li>Total capital of the client;</li>
                    <li>Commission charges by types.</li>
                    </ul>
                    
                    <h3>8. Obligations of the SFOR company regarding to the information storage</h3>
                    <p>The SFOR company provides keeping of all the information related to the client specified in article 8, both in documentary and electronic form, for 6 years.</p>
                    <p>The SFOR company also provides to keep all the copies of the information related to the client, which is certified (signed) by a person specifically designated for carrying out the verification In the SFOR company.</p>
                    
                    <h3>9. Reporting</h3>
                    <p>The SFOR company provides the relevant report for both the Financial Monitoring Service of Georgia and the National Bank of Georgia.</p>
                    <p>The following types of transactions existing in the brokerage about the client are subject to the report to be submitted to the Financial Monitoring Service of Georgia.</p>
                    <p>If the amount of all the transactions made for a transaction or its partition exceeds 30,000 GEL or its equivalent in other currency and at the same time it is:</p>
                    <ul>
                    <li>Transaction executed by securities on the name of the presenter;</li>
                    <li>Transaction executed with the participation of a suspicious financial institution;</li>
                    <li>Transaction executed by the person acting in a questionable or suspicious zone and/or by using the account of the bank operating in such zone;</li>
                    <li>Transaction executed by cash.</li>
                    </ul>
                    <p>The SFOR company, no later than 5 working days after receiving the information, submits the report about the above-mentioned transactions to the Financial Monitoring Service of Georgia:</p>
                    <ul>
                    <li>If the transaction or identification data is considered as suspicious – on the day of the originating of suspicious;</li>
                    <li>If any person participating in the transaction is included in the list of terrorists or persons supporting terrorism and/or may be associated with them and/or money funds involved in it may be related or used for terrorism, terrorist – on the day of receipt of the relevant information.</li>
                    </ul>
                    <p>The company provides the Financial Service of Georgia with all types of information in the form of documents.</p>
                    <p>In case of the existence of the above fact in the SFOR company, all employees of the SFOR company are obliged to inform the AML officer with the relevant information, who then will take the necessary measures. The employee may consider the client's behavior as suspicious, specified in Annex 6, all employees considering the client’s behavior as suspicious are obliged to inform the AML officer with the information about the client.</p>
                    <p>The AML officer keeps the recording on the reporting sent as by an electronic form or the form of the document:</p>
                    <ul>
                    <li>Creates an electronic folder containing an electronic version of all the documents created in accordance with this instruction;</li>
                    <li>The AML officer creates a folder, which will be intended for printed documents.</li>
                    </ul>
                    <p>The SFOR company submits the report to the National Bank of Georgia, which is prepared on the basis of the Order #40/04 of the President of the National Bank of Georgia. The order determines the rule of filling of the monitoring report and information submission of the risk on the legalization of illicit income of the SFOR company and terrorism funding.</p>
                    <h3>10. Suspension of the execution of transaction on the basis of the request of the Financial Monitoring Service of Georgia</h3>
                    <p>The SFOR company is obliged to suspend the transaction (operation) and/or any other transaction (operation) related to this transaction or the persons participating in it, on the basis of the written instruction of the Head of the Financial Monitoring Service of Georgia, within 72 hours (including only working days).</p>
                    <p>In case of urgent necessity, the Head of the Financial Monitoring Service of Georgia or a person authorized by him is obliged to give the instruction, orally (directly or by using the means of electronic communication) or written form, on suspension of the transaction to the person executing monitoring and the SFOR company shall suspend the execution of the transaction.</p>
                    <p>If after 24 hours the written instruction of the Head of the Financial Monitoring Service of Georgia has not issued and has not been transferred to the SFOR company, the SFOR company terminates the execution of the abovementioned instruction and establishes a relevant protocol on the fact, which will include the following:</p>
                    <ul>
                    <li>Full name (name and surname) and position of the issuer (authorized person of the Financial Monitoring Service of Georgia) and the recipient (authorized employee of the company) of the instruction;</li>
                    <li>Exact time issuance/receipt of the instruction (with the indication of hours and minutes);</li>
                    <li>Content of the instruction, including (oral, by using e-mail or other means of electronic communication);</li>
                    <li>Content of the instruction, including the information allowing the identification of the transaction (transactions) and/or the person executing the transaction;</li>
                    <li>Term of the termination of the transaction;</li>
                    <li>Confirmation of receipt of the instruction by the authorized employee of the SFOR company;</li>
                    <li>Date and exact time of drawing up of the protocol;</li>
                    <li>Signature of the relevant authorized employee of the Financial Monitoring Service/company.</li>
                    </ul>
                    <p>The SFOR company is obliged to confirm the receipt of the instruction to the Financial Monitoring Service of Georgia in writing and take the necessary measures for immediate execution of the revealed instructions.</p>
                    <p>The instruction may be cancelled before the deadline, if the assumption on the existence of the suspicious transaction is not confirmed, as well as resulting the interests of the investigation, on the basis of the written application of the General prosecutor of Georgia, relevant services of the Ministry of Internal Affairs of Georgia or the State Security of Georgia. In such a case, the Financial Monitoring Service of Georgia shall immediately inform the Company about the cancellation of the instruction, which will be signed within the next 24 hours by the written instruction of the Head of the Financial Monitoring Service of Georgia and transferred to the SFOR company.</p>
                    <p>The SFOR company is obliged to keep instructions (also received by electronic form) provided by the Head of the Financial Monitoring Services of Georgia for a period of no less than six years, if the relevant supervisory body does not require keeping the instructions for a long period.</p>
                    <h3>11. Recruitment and training</h3>
                    <p>Recruiting a new employee, the SFOR company pays great the cases connected with money laundering and terrorism funding.</p>
                    <p>The AML officer periodically carries out the training for the employees involved in business relationships with the clients.</p>
                    <p>The AML officer also participates in the approval of the available new products introduction in the SFOR company, in order to prevent unwanted risk, he develops relevant recommendations and later it will be introduced to the employees as well as the director of the SFOR company.</p>
                    <h4>Annex 1 - Product and Service Risk</h4>
                    <p>SFOR company divides its products and services into low, average and high risk categories.</p>
                    <p>Low risk category includes the following kinds of products.</p>
                    <p>SFOR company should individually assess its product/service and the risk of their means of provision, considering the personality of the client and the nature of their business relation. Upon risk assessment of product/service and their means of provision the SFOR company has to consider following factors:</p>
                    <ul>
                    <li>Product/service is assessed by appropriate international organizations as high risk-based (for example: international transfers, international transactions made by persons without their own accounts, when financial institute is a mediator, application of private bank’s service, withdrawal of financial instruments to submitter and others);</li>
                    <li>Provision of distant product/service (application of internet banking and other such technologies that complicates identification of parties participating in the operation);</li>
                    <li>Provision of product/service through mediator (agent).</li>
                    </ul>
                    <h4>Annex 2 - High Risk Activity</h4>
                    <p>High risk activity is:</p>
                    <ul>
                    <li>Activity related to lotteries and other profitable games, including online casinos and gambling, slot clubs and others;</li>
                    <li>Activity related to precious metals/stones and their products, bric-a-brac and art exponents;</li>
                    <li>Activity related to real estate agencies, real estate brokers;</li>
                    <li>Activity related to the production and sale of weapon and ammunition, military equipment and vehicle (parts);</li>
                    <li>Activity related to manufacturers/dealers of materials of nuclear reactors;</li>
                    <li>Activity related to the trade or/and production of chemical matters;</li>
                    <li>Activities related to large sum of heavy cash flow;</li>
                    <li>Organizations that activity is related to such business not oriented on profit;</li>
                    <li>Sports clubs;</li>
                    <li>Development, holding, asset management and shipping companies;</li>
                    <li>Companies providing purchase of foreign currency through electronic platform;</li>
                    <li>Organizations that main business is issue of loan (including creditors), except financial institutions;</li>
                    <li>FOREX;</li>
                    <li>Construction activity;</li>
                    <li>Oil business.</li>
                    </ul>
                    <h4>Annex 3 - Client Risk Assessment Form</h4>
                    <p>Client risk assessment is conducted in 3 levels:</p>
                    <ul>
                    <li>Low risk;</li>
                    <li>Average risk;</li>
                    <li>High risk.</li>
                    </ul>
                    <p>Low risk clients:</p>
                    <ul>
                    <li>Client with Georgian citizenship;</li>
                    <li>Client, whose business is within low risk category;</li>
                    <li>Client legal entity, whose registration country is Georgia;</li>
                    <li>Client legal entity, whose field of activity is the business of low risk category.</li>
                    </ul>
                    <p>Average risk clients:</p>
                    <ul>
                    <li>Client who is foreign citizen, though is not within the list of high risk countries;</li>
                    <li>Client, whose business is within average risk category;</li>
                    <li>Client legal entity, who is registered in the country not within the list of high risk countries;</li>
                    <li>Client legal entity, whose field of activity is the business of average risk category;</li>
                    <li>Client beneficiary owner, who is foreign citizen, except the country that is within the category of high risk countries.</li>
                    </ul>
                    <p>High risk clients:</p>
                    <ul>
                    <li>Client who is the citizen of high risk country;</li>
                    <li>Client who is politically exposed person (PEP);</li>
                    <li>Client, whose business is within high risk category;</li>
                    <li>Client who applies high risk products;</li>
                    <li>Client legal entity, who is registered in the country within the list of high risk countries;</li>
                    <li>Client legal entity, whose field of activity is the business of high risk category;</li>
                    <li>Client legal entity beneficiary owner, who is the citizen of high risk country;</li>
                    <li>Client legal entity beneficiary owner, who is politically exposed person (PEP);</li>
                    <li>Client legal entity who applies high risk products.</li>
                    </ul>
                    <h4>Annex 4 - Client’s Risk</h4>
                    <p>Client’s risk includes such kinds of activities of physical and legal entities (also organizational formations without the status of legal entity), conducted operations and peculiarities of conduct, also other signs that may stipulate the necessity of their classification within high risk. SFOR company maximally cares for such category of clients and applies strong measures of monitoring.</p>
                    <p>Within this category are:</p>
                    <ul>
                    <li>Politically exposed persons;</li>
                    <li>Clients, known as suspected of legalization of illegal income/the business of financing terrorism;</li>
                    <li>Clients, about whom state bodies of various countries made reference/warning with regard to their illegal activity;</li>
                    <li>Client who have complicated organizational and ownership structure;</li>
                    <li>Professional service providers;</li>
                    <li>Clients, whose business is related to precious metals/stones and their products, bric-a-brac and art exponents;</li>
                    <li>Persons organizing lotteries and other profitable games, including online casinos and gambling, slot clubs and others;</li>
                    <li>Client conducting production or/and sale of weapon and ammunition, military equipment and vehicle (parts);</li>
                    <li>Companies manufacturing/dealers of materials of nuclear reactors;</li>
                    <li>Client conducting trade or/and production of chemical matters;</li>
                    <li>Organizations that activity is not oriented of profit;</li>
                    <li>Client representing investment fund/company;</li>
                    <li>Client registered by trust agent;</li>
                    <li>Client conducting fractional doubtful and unusual transactions;</li>
                    <li>Client (legal entity) whose beneficiary owner is politically exposed person;</li>
                    <li>Client whose financial assets origin’s statement is complicated or/and doubtful;</li>
                    <li>Client whose cash flow is not noted after the opening of account within 1 year or more and after this period banking transactions are carried out with large amounts of money;</li>
                    <li>Client who manages his/her business relations in unusual circumstances, namely unusually long geographic distance is between financial institution in client;</li>
                    <li>Client who requires unusually high level of confidentiality;</li>
                    <li>Client who carries out frequent and groundless transfer of his/her accounts to various financial institutions;</li>
                    <li>Client’s transactions do not correspond to the activity carried out by him/her, the nature (amount) of his/her financial operations is suddenly (clearly) changed or/and irrelevant to his/her usual activity;</li>
                    <li>Client who systematically and purposefully carries out below limit transactions within the short period of time;</li>
                    <li>Business/economic relation is obscure between parties conducting transactions and scope of transaction is unclear;</li>
                    <li>Client who prevents or is late in provision standard information;</li>
                    <li>Clients whose transactions or cash operations significantly differ from financial operations of clients with similar activity;</li>
                    <li>Such other circumstances that raise doubts about a client's riskiness (for example: identification documents, his/her reputation or past activity and others).</li>
                    </ul>
                    <h4>Annex 5 - Permission on Establishment Business Relation with High Risk Category Client</h4>
                    <p>To director of Cyber Security Group LLC,</p>
                    <p>Mr. ________________</p>
                    <p>Be informed that ________________ LTD (name), (I/C ________________) desires establishment of business relation with SFOR company that according to the procedure of granting risk criterion worked out by SFOR company is high risk person due to following reason: director and beneficiary owner of company is the citizen of the Republic of Iran.</p>
                    <p>At this stage with regard to legal entity is known following:</p>
                    <p>________________ LTD</p>
                    <p>I/C ________________</p>
                    <p>Ordinary business ________________</p>
                    <p>Beneficiary owner ________________</p>
                    <p>Purposefulness of registration ________________</p>
                    <p>Possible turnover within the context of 1 year ________________</p>
                    <p>Bank accounts ________________</p>
                    <p>By providing information be informed that beneficiary owner ________________ LTD is registered at our SFOR company, account of “________________” LTD with its business of trade of toys.</p>
                    <p>Please, permit us to establish a business relation with “________________” LTD. (I/C ________________).</p>
                    
                    <p>Best regards,</p>
                    <p>Name, surname</p>
                    <p>________________</p>
                    <p>Date:</p>
                    <h4>Annex 6 - Doubtful Conduct of Client</h4>
                    <p>Information provided to SFOR company by client is insufficient, false or doubtful;</p>
                    <p>Client is involved in such business that is known as high risk activity related to “money laundering”, for example gambling, jewelry stores and others;</p>
                    <p>Client refuses provision of information about beneficiary owners to SFOR company;</p>
                    <p>Client refuses submission of additional information required by SFOR company that is essential for proper cooperation;</p>
                    <p>Source of origin of client’s assets is undefined, refuses its disclosure;</p>
                    <p>Client refuses signing agreement submitted by SFOR company;</p>
                    <p>Client asks questions with regard to monitoring of transactions.</p>
                    <h4>Annex 7 - Consent of Director on Establishment of Business Relation with Politically Exposed Person (PEP)</h4>
                    <p>To director of Cyber Security Group LLC.</p>
                    <p>Mr. ________________</p>
                    <p>Under the basis of law “On Facilitating the Prevention of Illicit Income Legalization” related to politically exposed persons, please allow us establishment of business relation with Mr./Mrs., name, surname (position, occupation), who pursuant to the interpretation of Georgian legislation is politically exposed person (foreign citizen).</p>
                    
                    <p>Best regards,</p>
                    <p>________________</p>
                    <p>Signature</p>
                    <p>Date: --/--/--202-</p>


                    </div>

                </div> 
                     
            </div> 
              
       <Footer />
       </div> 
   );
}