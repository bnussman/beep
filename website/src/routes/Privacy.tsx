import React from 'react';
import { Stack, Heading, Box, Center, Text, Accordion, AccordionItem, AccordionIcon, AccordionButton, AccordionPanel, UnorderedList, ListItem, ListIcon } from "@chakra-ui/react"

const Introduction = () => {
  return (
    <Center>
      <Box w='90%'>
        <Text fontSize='sm' margin={2}>
          Thank you for choosing to be part of our community at Ride Beep (“Company”, “we”, “us”, or “our”). We
          are committed to protecting your personal information and your right to privacy. If you have any
          questions or concerns about this privacy notice, or our practices with regards to your personal
          information, please contact us at banks@ridebeep.app.
          When you visit our website ridebeep.app (the "Website"), use our mobile application, as the case may
          be (the "App") and more generally, use any of our services (the "Services", which include the
          Website and App), we appreciate that you are trusting us with your personal information. We take
          your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way
          possible what information we collect, how we use it and what rights you have in relation to it. We
          hope you take some time to read through it carefully, as it is important. If there are any terms
          in this privacy notice that you do not agree with, please discontinue use of our Services immediately.
          Thisprivacy notice applies to all information collected through our Services (which, as described
          above, includes our Website and App), as well as any related services, sales, marketing or events.
        </Text>
        <Text fontSize='sm' fontWeight='bold' margin={2}>
          Please read this privacy notice carefully as it will help you understand what we do with the
          information that we collect.
        </Text>
      </Box>
    </Center>
  );
}

const InformationCollected = () => {
  return (
    <Center>
      <Box w='90%'>
        <Text fontSize='md' fontWeight='bold' margin={2}>
          Personal information you disclose to us
        </Text>
        <Text fontSize='sm' margin={2}>
          <Box marginBottom={2}><i><b>In short:</b> We collect information that you provide to us. </i><br /></Box>
          We collect personal information that you voluntarily provide to us when you register on the Services,
          express an interest in obtaining information about us or our products and Services, when you
          participate in activities on the Services (such as by posting messages in our online forums or
          entering competitions, contests or giveaways) or otherwise when you contact us.
          The personal information that we collect depends on the context of your interactions with us and the
          Services, the choices you make and the products and features you use. The personal information we
          collect may include the following:
        </Text>
        <Text fontSize='sm' margin={2}>
          <b>Personal information provided by you.</b> We collect names; phone numbers; email addresses; usernames;
          passwords; venmo username; and other similar information.
          All personal information that you provide to us must be true, complete and accurate, and you must
          notify us of any changes to such personal information.
        </Text>
        <Text fontSize='md' fontWeight='bold' margin={2}>
          Information automatically collected
        </Text>
        <Text fontSize='sm' margin={2}>
          <Box marginBottom={2}><i><b>In short:</b> Some information — such as your Internet Protocol (IP)
            address and/or browser and device characteristics — is collected automatically when you visit our
            Services. </i><br /></Box>We automatically collect certain information when you visit, use or
          navigate the Services. This information does not reveal your specific identity (like your name
          or contact information) but may include device and usage information, such as your IP address,
          browser and device characteristics, operating system, language preferences, referring URLs, device
          name, country, location, information about who and when you use our Services and other technical
          information. This information is primarily needed to maintain the security and operation of our
          Services, and for our internal analytics and reporting purposes.<br />
          Like many businesses, we also collect information through cookies and similar technologies. The
          information we collect includes:
          <Box margin={3}>
            <UnorderedList spacing={3}>
              <ListItem>Log and Usage Data. Log and usage data is service-related, diagnostic usage and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called 'crash dumps') and hardware settings).</ListItem>
              <ListItem>Device Data. We collect device data such as information about your computer, phone, tablet or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device application identification numbers, location, browser type, hardware model Internet service provider and/or mobile carrier, operating system configuration information.</ListItem>
              <ListItem>Location Data. We collect information data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type of settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Locations settings on your device. Note however, if you choose to opt out, you may not be able to use certain aspects of the Services.</ListItem>
            </UnorderedList>
          </Box>
        </Text>
        <Text fontSize='md' fontWeight='bold' margin={2}>
          Information collected through our app
        </Text>
        <Text fontSize='sm' margin={2}>
          <Box marginBottom={2}><i><b>In short:</b> We collect information regarding your geo-location,
            push notifications, when you use our App.</i><br /></Box>
          If you use our App, we also collect the following information: <br />
          <Box margin={3}>
            <UnorderedList spacing={3}>
              <ListItem>Geo-Location Information. We may request access or permission to and track location-based information from your mobile device, either continuously or while you are using our App, to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device's settings.</ListItem>
              <ListItem>Push Notifications. We may request to send you push notifications regarding your account or certain features of the App. If you wish to opt-out from receiving these types of communications, you may turn them off in your device's settings.</ListItem>
            </UnorderedList>
            <br />
            <Text fontSize='sm'>
              The information is primarily needed to maintain the security and operation of our App,
              for troubleshooting and for our internal analytics and reporting purposes.
            </Text>
          </Box>
        </Text>
      </Box>
    </Center>
  )
}

const HowWeUseInfo = () => {
  return (
    <Center>
      <Box w='90%'>
        <Text fontSize='md' fontWeight='bold' margin={2}>
          Personal information you disclose to us
        </Text>
        <Text fontSize='sm' margin={2}>
          <Box marginBottom={2}><i><b>In short:</b> We process your information for purposes
            based on legitimate business interests, the fulfillment of our contract with you,
            compliance with our legal obligations, and/or your consent. </i><br /></Box>
        </Text>
        <Text fontSize='sm' margin={2}>
          We use personal information collected via our Services for a variety of business
          purposes described below. We process your personal information for these purposes
          in reliance on our legitimate business interests, in order to enter into or
          perform a contract with you, with your consent, and/or for compliance with our
          legal obligations. We indicate the specific processing grounds we rely on next to
          each purpose listed below.We use personal information collected via our Services
          for a variety of business purposes described below. We process your personal
          information for these purposes in reliance on our legitimate business interests,
          in order to enter into or perform a contract with you, with your consent, and/or
          for compliance with our legal obligations. We indicate the specific processing
          grounds we rely on next to each purpose listed below.
        </Text>
        <Text fontSize='sm' margin={2}>
          We use the information we collect or receive:<br />
        </Text>
        <Text fontSize='sm' margin={2}>
          <Box margin={3}>
            <UnorderedList spacing={3}>
              <ListItem><b>To facilitate account creation and logon process.</b> If you choose to link your account with us to a third-party account (such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process for the performance of the contract.</ListItem>
              <ListItem><b>To post testimonials.</b> We post testimonials on our Services that may contain personal information. Prior to posting a testimonial, we will obtain your consent to use your name and the consent of the testimonial. If you wish to update, or delete your testimonial, please contact us at banks@ridebeep.app and be sure to include your name, testimonial location, and contact information.</ListItem>
              <ListItem><b>Request feedback.</b> We may use your information to request feedback and to contact you about your use of our Services.</ListItem>
              <ListItem><b>To enable user-to-user communications.</b> We may use your information in order to enable user-to-user communications with each user's consent.</ListItem>
              <ListItem><b>To manage user accounts.</b> We may use your information for the purposes of managing our account and keeping it in working order.</ListItem>
              <ListItem><b>To send administrative information to you.</b> We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.</ListItem>
              <ListItem><b>To protect our Services.</b> We may use your information as part of our efforts to keep our Services safe and secure (for example, for fraud monitoring and prevention).</ListItem>
              <ListItem><b>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</b></ListItem>
              <ListItem><b>To respond to legal requests and prevent harm.</b> If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.</ListItem>
              <ListItem><b>Fulfill and manage your orders.</b> We may use your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.</ListItem>
              <ListItem><b>Administer prize draws and competitions.</b> We may use your information to administer prize draws and competitions when you elect to participate in our competitions.</ListItem>
              <ListItem><b>To deliver and facilitate delivery of services to the user.</b> We may use your information to provide you with the requested service.</ListItem>
              <ListItem><b>To respond to user inquiries/offer support to users.</b> We may use your information to respond to your inquiries and solve any potential issues you might have with the use of our Services.</ListItem>
              <ListItem><b>To send you marketing and promotional communications.</b> We and/or our third-party marketing partners may use the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. For example, when expressing an interest in obtaining information about us or our Services, subscribing to marketing or otherwise contacting us, we will collect personal information from you. You can opt-out of our marketing emails at any time (see the "What Are Your Privacy Rights" below).</ListItem>
              <ListItem><b>Deliver targeted advertising to you.</b> We may use your information to develop and display personalized content and advertising (and work with third parties who do so) tailored to your interests and/or location and to measure its effectiveness.</ListItem>
            </UnorderedList>
          </Box>
        </Text>
      </Box>
    </Center>
  );
}

const SharedInfo = () => {
  return (
    <Center>
      <Box w='90%'>
        <Text fontSize='sm' margin={2}>
          <Box marginBottom={2}><i><b>In short:</b> We only share information with your consent,
            to comply with laws, to provide you with services, to protect your rights, or to fulfill
            business obligations.</i></Box>
        </Text>
        <Text fontSize='sm' margin={2}>
          We may process or share your data that we hold based on the following legal basis:
        </Text>
        <Text fontSize='sm' margin={2}>
          <Box margin={3}>
            <UnorderedList spacing={3}>
              <ListItem><b>Consent:</b> We may process your data if you have given us specific consent to
                use your personal information in a specific purpose.</ListItem>
              <ListItem><b>Legitimate Interests:</b> We may process your data when it is reasonably
                necessary to achieve our legitimate business interests.</ListItem>
              <ListItem><b>Performance of a Contract:</b> Where we have entered into a contract with you,
                we may process your personal information to fulfill the terms of our contract.</ListItem>
              <ListItem><b>Legal Obligations:</b> We may disclose your information where we are legally
                required to do so in order to comply with applicable law, governmental requests, a judicial
                proceeding, court order, or legal process, such as in response to a court order or a
                subpoena (including in response to public authorities to meet national security or law
                enforcement requirements).</ListItem>
              <ListItem><b>Vital Interests:</b> We may disclose your information where we believe
                it is necessary to investigate, prevent, or take action regarding potential violations
                of our policies, suspected fraud, situations involving potential threats to the safety
                of any person and illegal activities, or as evidence in litigation in which we are
                involved.</ListItem>
            </UnorderedList>
          </Box>
        </Text>
        <Text fontSize='sm' margin={2}>
          More specifically, we may need to process your data or share your personal information in the following situations:
        </Text>
        <Box margin={3}>
          <Text fontSize='sm' margin={2}>
            <UnorderedList spacing={3}>
              <ListItem><b>Business Transfers:</b> We may share or transfer your information
                in connection with, or during negotiations of, any merger, sale of company assets,
                financing, or acquisition of all or a portion of our business to another company.</ListItem>
              <ListItem><b>Business Partners:</b> We may share your information with our
                business partners to offer you certain products, services or promotions.</ListItem>
              <ListItem><b>Other Users:</b> When you share personal information or otherwise
                interact with public areas of the Services, such personal information may be
                viewed by all users and may be publicly made available outside the Services
                in perpetuity. Similarly, other users will be able to view descriptions of
                your activity, communicate with you within our Services, and view your profile.</ListItem>
            </UnorderedList>
          </Text>
        </Box>
      </Box>
    </Center>
  );
}

const Cookies = () => {
  return (
    <Center>
      <Box w='90%'>
        <Text fontSize='sm' margin={2}>
          <Box marginBottom={2}><i><b>In short:</b> Yes, we use Google Maps for the purpose
            of providing better service.</i></Box>
        </Text>
        <Text fontSize='sm' margin={2}>
          This Website or App uses Google Maps APIs which is subject to Google's Terms of
          Service. You may find the Google Maps APIs Terms of Service here. To find out
          more about Google’s Privacy Policy, please refer to this link.
        </Text>
      </Box>
    </Center>
  );
}

export function Privacy() {
  return (
    <Stack spacing={6} margin={10}>
      <Center margin={10}>
        <Heading size='2xl'>
          Privacy Policy
        </Heading>
      </Center>
      <Center>
        <Heading size='1xl' marginBottom={5}>
          Modified and Effective as of January 2, 2021
        </Heading>
      </Center>
      <Center>
        <Accordion w='85%'>
          <AccordionItem>
            <AccordionButton>
              <Box flex='1' textAlign='center' margin={2}>
                <Heading size='1xl'>
                  Introduction
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Introduction />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex='1' textAlign='center' margin={2}>
                <Heading size='1xl'>
                  What Information Do We Collect?
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <InformationCollected />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex='1' textAlign='center' margin={2}>
                <Heading size='1xl'>
                  How Do We Use Your Information?
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <HowWeUseInfo />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex='1' textAlign='center' margin={2}>
                <Heading size='1xl'>
                  Will Your Information Be Shared With Anyone?
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <SharedInfo />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex='1' textAlign='center' margin={2}>
                <Heading size='1xl'>
                  Do We Use Cookies and Other Tracking Technologies?
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Cookies />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Center>
    </Stack>

    // <div className="px-4 mx-auto lg:container dark:text-white">
    //   <div className="mb-4 overflow-hidden rounded shadow-md">
    //     <div className="p-8">
    //       <br />
    //       <p className="c17 title" id="h.nwye47m6ncih"><span className="c13">Privacy Policy</span></p>
    //       <br />

    //       <p className="c4"><span className="c5">Modified: January 2, 2021</span></p>
    //       <p className="c4"><span className="c6">Effective</span><span className="c6">:</span><span className="c6">&nbsp;</span><span>January 2, 2021</span></p>
    //       <ol className="c12 lst-kix_7gu2p9q0wakt-0 start">
    //         <li className="c1 li-bullet-0">
    //           <h1 id="h.qphupxdneu4l" ><span>Introduction</span></h1>
    //         </li>
    //       </ol>
    //       <p className="c4"><span className="c0">When using Beep you intrust us with all of your personal information and we will uphold that trust and that begins with the understanding of our privacy policy.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c6">This entails the personal data we collect, how it is shared and used, and what you can do regarding your data. Reading this is the best way to fully grasp what we do with your data.</span></p>
    //       <ol className="c12 lst-kix_7gu2p9q0wakt-0">
    //         <li className="c1 li-bullet-0">
    //           <h1 id="h.n44x2mlf3lm6" ><span className="c16">Overview</span></h1>
    //         </li>
    //       </ol>
    //       <h2 className="c14" id="h.gs256myf5zqa"><span className="c9">Scope</span></h2>
    //       <p className="c4"><span className="c0">This notice applies to users of any of Beeps services including Beeps app, features, website, or other services. This notice describes how Beep uses and collects personal data. This applies to all users of the app and website. This especially applies to the Users and Drivers.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c0">&ldquo;Users&rdquo;: These are the riders that get in contact with the Drivers/Beepers and communicate with them on how to get transportation from one place to another.</span></p>
    //       <p className="c4"><span className="c0">&ldquo;Drivers&rdquo;: Drivers or sometimes called beepers are the individuals that put their information out there for Users to communicate with them over the location and details of where to pick the User up.</span></p>
    //       <p className="c4"><span className="c0">&ldquo;Account Holder&rdquo;: The term Account Holder can be used to define all people who use the Services of Beep, whether that person is a User or a Driver. </span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c0">All those subject to this are referred to as &ldquo;Account Holder&rdquo;, in this notice.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c0">For the purposes of this document, Ian &amp; Banks LLC and the name of the mobile application, Ride Beep App, will be referred to as &ldquo;Beep&rdquo;.</span></p>
    //       <h2 className="c14" id="h.nauxk0ckhedd"><span className="c9">Data controller and transfer</span></h2>
    //       <p className="c4"><span className="c6">Ian and Banks LLC are the only ones that control the all of the personal data collected with Ride Beep App.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c6">Beep operates and processes all of our data in the United States and does not send anything overseas or to another country. This fulfills our agreements made in the Terms of Service Agreement and agreements made with the Account Holders. Any questions can be sent to ian@ridebeep.app.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <ol className="c12 lst-kix_7gu2p9q0wakt-0">
    //         <li className="c1 li-bullet-0">
    //           <h1 id="h.xpkxb8edrdhl" ><span className="c16">Data collections and uses</span></h1>
    //         </li>
    //       </ol>
    //       <p className="c4 c8"><span className="c10"></span></p>
    //       <h2 className="c14" id="h.vh74vptikyv0"><span className="c9">A. Data we collect</span></h2>
    //       <p className="c4 c8"><span className="c2"></span></p>
    //       <p className="c4"><span className="c0">Beep collects:</span></p>
    //       <p className="c4"><span className="c0">Data provided by the Account Holder to Beep when creating an account.</span></p>
    //       <p className="c4"><span className="c0">Data that is created when using Beep, like location.</span></p>
    //       <p className="c4"><span className="c0">Data from other sources that are not the app.</span></p>
    //       <p className="c4"><span className="c0">The following data is collected by or on behalf of Beep:</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">1. Data provided by the Account Holder</span></p>
    //       <p className="c4"><span className="c0">User profile: This is the data that the person puts into their account when creating or updating their account. This data includes username, first and last name, Venmo username, email, and phone number. This also includes the picture that is provided for the profile picture for the Account Holders account.</span></p>
    //       <p className="c4"><span className="c6">User content: We collect information when Account Holders submit things to contact Beep. This may include photos, videos or voice recordings that the Account Holder has sent either through an email or through the report system.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">2. Data created during the use of our services:</span></p>
    //       <p className="c4"><span className="c0">Location data (Driver): Beep collects this data when the Beep app is running in the foreground (app open and on-screen) and background (app open but not on-screen) of one&rsquo;s mobile device.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c0">Location data (Riders): We collect precise or approximate location data from riders&rsquo; mobile devices if they enable Beep to do so. Beep collects this data when the Beep app is running in the foreground (app open and on-screen) and background (app open but not on-screen) of their mobile device. We use this data to enhance your use of our apps, including to improve pick-up locations, estimated time of rivals, and for safety measures.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c0">Transaction information: We collect the pickup and destination locations, the group size and the amount that is supposed to be paid to the driver. We collect the date and time of the ride given as well.</span></p>
    //       <p className="c4"><span className="c6">Device data: We may collect data about the devices used to access our services, including the hardware models, device IP address, operating systems and versions, software, preferred languages, unique device identifiers, and mobile network data.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">3. Data from other sources:</span></p>
    //       <p className="c4"><span className="c6">Account Holders&rsquo;</span><span className="c0">&nbsp;feedback, such as ratings, feedback, or reports.</span></p>
    //       <p className="c4"><span className="c0">Account Holders&rsquo; inputs from surveys conducted by Beep.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <h2 className="c14" id="h.wsfqv9mxcchv"><span className="c9">B. How we use personal data</span></h2>
    //       <p className="c4 c8"><span className="c2"></span></p>
    //       <p className="c4"><span className="c6">Beep collects and uses data to enhance the service we provide and make a better experience for all of its Account Holders.</span></p>
    //       <p className="c4"><span className="c0">Beep uses data it collects for purposes including:</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c6 c7">1. Providing services and features</span></p>
    //       <p className="c4"><span className="c0">Create and update the Account Holders&rsquo; accounts.</span></p>
    //       <p className="c4"><span className="c0">Facilitate a way for payment to occur.</span></p>
    //       <p className="c4"><span className="c0">Track and share progress of the ride being given.</span></p>
    //       <p className="c4"><span className="c6">Enable features that allow Account Holders to share information with other Account Holders, such as phone numbers, names, Venmo usernames, profile pictures, and location for direction </span><span className="c6">purposes</span><span className="c0">. </span></p>
    //       <p className="c4"><span className="c0">Perform internal operations necessary to provide our services, including to troubleshoot software bugs and operational problems; to conduct data analysis, testing, and research; and to monitor and analyze usage and activity trends.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c15 c6">2. </span><span className="c7 c6">Safety and security.</span></p>
    //       <p className="c4"><span className="c6">We use location data from drivers to identify unsafe driving procedures like how fast they are driving. </span><span className="c6">We collect emails and use them to show to others if it is a student that is using the app.</span><sup><a href="#cmnt1" id="cmnt_ref1">[a]</a></sup><sup><a href="#cmnt2" id="cmnt_ref2">[b]</a></sup><span className="c0">&nbsp;We use user feedback as grounds for deactivating somebody&#39;s account or suspending them from the app.</span></p>
    //       <p className="c4"><span className="c0">Anything received for customer support we collect and use to help that customer in the best way possible. This could be through our report systems emails or another form of communication.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">3.Enabling communication between Account Holders.</span></p>
    //       <p className="c4"><span className="c0">This includes calling somebody if they lost an item or have them communicate to confirm a location or give a better time estimate.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">4. Marketing</span></p>
    //       <p className="c4"><span className="c0">Beep may use the data we collect to inform users about upcoming changes, promotions, surveys, studies, news or other general updates.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">5. Non-marketing communications</span></p>
    //       <p className="c4"><span className="c0">Beep may use the data we collect to inform users of changes in our Terms of Service Agreement, services, policies, or send other communications that are not the purpose of marketing our services.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">6. Legal proceedings and requirements</span></p>
    //       <p className="c4"><span className="c6">We may use the personal data we collect to investigate or address claims or disputes relating to the use of Beeps services.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <h2 className="c14" id="h.z4dalapkpm5m"><span className="c9">C. Data sharing and disclosure</span></h2>
    //       <p className="c4 c8"><span className="c2"></span></p>
    //       <p className="c4"><span className="c0">Beep may share the data we collect with:</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">1. With other Account Holders</span></p>
    //       <p className="c4"><span className="c6">Users names, phone number, Venmo username, pick-up and destination locations, verification</span><span className="c6">&nbsp;</span><sup><a href="#cmnt3" id="cmnt_ref3">[c]</a></sup><sup><a href="#cmnt4" id="cmnt_ref4">[d]</a></sup><span className="c0">if they are a student, profile picture, and group size are all shared with the Drivers.</span></p>
    //       <p className="c4"><span className="c6">Users names, phone number, Venmo username,</span><span className="c6">&nbsp;</span><sup><a href="#cmnt5" id="cmnt_ref5">[e]</a></sup><sup><a href="#cmnt6" id="cmnt_ref6">[f]</a></sup><span className="c0">verification if they are a student, profile picture, maximum vehicle capacity, and their current rates are all shared with the User.</span></p>
    //       <p className="c4"><span className="c6">The location is shared with Beep for the purpose of giving an estimated time of arrival for the User.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c15 c6">2. </span><span className="c7 c6">With the general public</span></p>
    //       <p className="c4"><span className="c0">Questions or comments from Account Holders submitted through Beeps&rsquo; social media pages may be viewable by the public and any information provided with those comments or questions.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c6 c15">3. </span><span className="c7 c6">For legal reasons or in the event of a dispute</span></p>
    //       <p className="c4"><span className="c0">Beep may share Account Holders&rsquo; personal data if it is required by law, regulations, or agreement made. This will be with legal process, by government request, or otherwise appropriate for safety concerns.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c15 c6">4. </span><span className="c7 c6">With consent</span></p>
    //       <p className="c4"><span className="c0">Beep may share personal data, other than for the purposes described above, if we notify the Account Holder and they consent to the sharing of data.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <h2 className="c14" id="h.ihal62p4purg"><span className="c9">D. Data retention and deletion</span></h2>
    //       <p className="c4 c8"><span className="c2"></span></p>
    //       <p className="c4"><span className="c0">Beep retains the Account Holders&rsquo; information for as long as they have an account with Beep.</span></p>
    //       <p className="c4"><span className="c0">Account Holders have the ability to request deletion of their account at any time by providing written notice to: ian@ridebeep.app.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <h2 className="c14" id="h.3cey4ikg0eyu"><span className="c9">E. Grounds for processing personal data</span></h2>
    //       <p className="c4 c8"><span className="c2"></span></p>
    //       <p className="c4"><span className="c6">We collect personal data only when we have the lawful grounds for it. This includes processing Account Holders&rsquo; personal data to provide the services to make a successful experience for all the Account Holders involved. This is for all of the reasons that we have already stated above and in our Terms of Service Agreement.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <ol className="c12 lst-kix_7gu2p9q0wakt-0">
    //         <li className="c1 li-bullet-0">
    //           <h1 id="h.1s2epfoal3vi"><span className="c16">Choice and transparency</span></h1>
    //         </li>
    //       </ol>
    //       <p className="c4 c8"><span className="c10"></span></p>
    //       <p className="c4"><span className="c0">Beep enables Account Holders to control and access the data that Beep collects through:</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">1. In app settings</span></p>
    //       <p className="c4"><span className="c6">Account Holders</span><span className="c0">&nbsp;can change their account details through the dashboard on the app or through the website.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c7 c6">2. Device settings</span></p>
    //       <p className="c4"><span className="c0">Location data: Account Holders can go to their device settings and not allow Beep to obtain their location information.</span></p>
    //       <p className="c4"><span className="c0">Notifications: Notifications from the app can also be changed and edited through the Account Holders&rsquo; personal devices to the format they desire.</span></p>
    //       <p className="c4 c8"><span className="c0"></span></p>
    //       <p className="c4"><span className="c6">Beep will answer any questions or provide answers to any problems with the above information, by contacting: ian@ridebeep.app. Any updates to this document will be announced and Account Holders will be notified about what has changed.</span></p>
    //       <div className="c3">
    //         <p className="c11"><a href="#cmnt_ref1" id="cmnt1">[a]</a><span className="c5">Is this in a way saying that only students can use the app? If we use the term verify you are stating that Beep will take action against non-students.</span></p>
    //       </div>
    //       <div className="c3">
    //         <p className="c11"><a href="#cmnt_ref2" id="cmnt2">[b]</a><span className="c5">I will use different wording then</span></p>
    //       </div>
    //       <div className="c3">
    //         <p className="c11"><a href="#cmnt_ref3" id="cmnt3">[c]</a><span className="c5">Is this in a way saying that only students can use the app? If we use the term verify you are stating that Beep will take action against non-students.</span></p>
    //       </div>
    //       <div className="c3">
    //         <p className="c11"><a href="#cmnt_ref4" id="cmnt4">[d]</a><span className="c5">I will use different wording then</span></p>
    //       </div>
    //       <div className="c3">
    //         <p className="c11"><a href="#cmnt_ref5" id="cmnt5">[e]</a><span className="c5">Is this in a way saying that only students can use the app? If we use the term verify you are stating that Beep will take action against non-students.</span></p>
    //       </div>
    //       <div className="c3">
    //         <p className="c11"><a href="#cmnt_ref6" id="cmnt6">[f]</a><span className="c5">I will use different wording then</span></p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
