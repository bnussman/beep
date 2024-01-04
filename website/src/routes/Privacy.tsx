import React from 'react';
import { Stack, Heading, Box, Text, Accordion, AccordionItem, AccordionIcon, AccordionButton, AccordionPanel, UnorderedList, ListItem } from "@chakra-ui/react"
import { Route } from '@tanstack/react-router';
import { rootRoute } from '../App';

export const privacyRoute = new Route({
  component: Privacy,
  path: "/privacy",
  getParentRoute: () => rootRoute,
});

const Introduction = () => {
  return (
    <Box>
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
  );
}

const InformationCollected = () => {
  return (
    <Box>
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
  )
}

const HowWeUseInfo = () => {
  return (
    <Box>
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
  );
}

const SharedInfo = () => {
  return (
    <Box>
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
  );
}

const Cookies = () => {
  return (
    <Box>
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
  );
}

export function Privacy() {
  return (
    <Stack alignItems="center">
      <Heading size='2xl'>
        Privacy Policy
      </Heading>
      <Heading size='1xl'>
        Modified and Effective as of January 2, 2021
      </Heading>
      <Accordion allowMultiple allowToggle w="100%" defaultIndex={[0, 1, 2, 3, 4]}>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' fontWeight="bold" fontSize="xl">
              Introduction
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Introduction />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' fontWeight="bold" fontSize="xl">
              What Information Do We Collect?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <InformationCollected />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' fontWeight="bold" fontSize="xl">
              How Do We Use Your Information?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <HowWeUseInfo />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' fontWeight="bold" fontSize="xl">
              Will Your Information Be Shared With Anyone?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <SharedInfo />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' fontWeight="bold" fontSize="xl">
              Do We Use Cookies and Other Tracking Technologies?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Cookies />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}
