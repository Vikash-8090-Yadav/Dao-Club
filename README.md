#  This project is made under PUSH BEB Hackathon



# Data Dao Club

Dao Club allows you to manage investment clubs, and to spread access to participate in investment funds to anyone, decentralized, agile, and without bureaucracy

<br>

  
## 📋 Table of Contents

- [Introduction](#introduction)
- [What It Does ?](#what-it-does)
- [Installation](#-setting-up-the-project-locally)
- [The problem it solves](#the-problem-it-solves)
- [Challenges we ran into](#-challenges-we-ran-into)
- [Project Gallery](#Project-Gallery)
- [Technologies we used](#%EF%B8%8Ftechnologies-we-used)
- [Video Demo](#-video-demo)
- [Contributing](#-contributing)

</div>
<a href="#top">Back to top</a>


 
## 💡Introduction

IC CLUB stands as a pioneering platform, revolutionizing the landscape of investment management. At its core, IC CLUB is designed to empower users by providing a decentralized, agile, and bureaucracy-free environment for managing investment clubs. The platform leverages innovative technologies to ensure transparency, security, and efficiency in investment processes.

One of the standout features of IC CLUB is its commitment to decentralization. Through the use of blockchain technology, the platform ensures that investment club data is transparent, secure, and immutable. This decentralized approach eliminates the need for intermediaries, putting control directly into the hands of the users.'
 
## 💡Our Vision
At IC CLUB, we envision a future where investment management is seamlessly woven into the fabric of decentralization, empowerment, and innovation. Our vision is to transform the traditional landscape of investment clubs by pioneering a platform that empowers individuals, nurtures financial autonomy, and redefines the norms of transparency and security.

In this future, IC CLUB stands as a beacon of decentralization, embracing the power of blockchain technology to forge a new era in investment management. We see a world where users have direct control over their financial endeavors, free from the constraints of bureaucracy and intermediaries. The platform is designed to be agile, responsive, and tailored to the needs of those who seek a more transparent, secure, and efficient investment experience.



# What it does

## Create Data Dao Investment Clubs

- Users can easily create investment clubs by providing a club name.
- The club becomes associated with the account of the user who creates it (owner).
![Screenshot from 2023-12-21 04-37-17](https://github.com/Vikash-8090-Yadav/Dao-Club/assets/85225156/f799ed27-e9dd-4d82-82b1-fa7ac920b316)


## Join or Leave and Contribute to the Club 
- Data Dao Members can contribute to the common fund (pool) by depositing ICP coins.
- Contributions can be utilized in proposals.
  
![Screenshot from 2023-12-21 04-43-03](https://github.com/Vikash-8090-Yadav/Dao-Club/assets/85225156/2c82dbc3-071a-4e05-adbe-53d752f556f3)


Transaction after contribution 
![Screenshot from 2023-12-21 04-43-54](https://github.com/Vikash-8090-Yadav/Dao-Club/assets/85225156/98adfc21-9129-4748-9781-b2a67cb9c227)

## Create and Vote on Proposals

- Members who contribute funds to the club pool can create proposals.
- Proposals include a description, amount (not exceeding the pool amount), and recipient for potential investments.
- All members can approve or reject proposals with one vote per member on each proposal.
  
- ![Screenshot from 2023-12-21 04-44-34](https://github.com/Vikash-8090-Yadav/Dao-Club/assets/85225156/4b97a1a9-a529-4fe1-a37d-302f33e47fc6)


## Execute and Close proposal

- Proposal owners, with greater approval than rejection, can execute proposals.
- Can't execute in voting periods which last for 5 min after creation. 
- This action transfers the proposal amount to the specified recipient.
- Owners can also close proposals for various reasons, such as cancellation or to avoid sending funds.
- 
- ![Screenshot](https://github.com/Vikash-8090-Yadav/IC-CLUB/assets/85225156/4ca59e4e-5725-45d3-80cd-506e93a35b24)

- After executing  (The amount 1 FIL transferred to the destination address)
- for verification - https://calibration.filfox.info/en/message/bafy2bzacea2ll2jp72i26llpabdkapcgp7oj2atyt6jbbnbo7hvr5jfuexr56?t=1

  ![Screenshot from 2023-12-21 05-01-43](https://github.com/Vikash-8090-Yadav/Dao-Club/assets/85225156/30eaa5a1-e3ba-4574-9dc8-2b27e29bf6d9)



## PODSI Verification

## Upload on LightHouse
- All the dataset is being uploaded and managed by LightHouse only
- ![Screenshot from 2023-12-21 05-06-16](https://github.com/Vikash-8090-Yadav/Dao-Club/assets/85225156/d330d508-a6ad-47fe-949e-f1251048f3a5)


## RAAS JOB
- Data Dao member can only register for JOb to create proposal and Vote on them
  
- ![Screenshot from 2023-12-21 04-47-20](https://github.com/Vikash-8090-Yadav/Dao-Club/assets/85225156/488d2d61-5cd7-4b8f-8786-fd2234cc336f)


## Deal and storage status

## 🔍The problem it solves

In the face of systemic challenges within the traditional private investment fund market, IC CLUB emerges as a transformative solution, addressing the longstanding barriers that have hindered the participation of aspiring investors in funding initiatives for innovative projects, including startups.

<br>

## 💥 Challenges we ran into

**MOTOKO:**
- Building scalable smart contracts is a challenging task that requires hard work and dedication. Despite the difficulties, I was able to make it happen. Our main challenge was to make the contract dynamic and responsive to all users. For instance, if a user adds a course, it should only be visible on their dashboard, not to everyone who logs in to the DApp.

<br>

<a href = "#top">Back to top</a>



### 	▶️ Experience the Live Site by Clicking the Link Below
<br>
<div align="center">
  <table>
    <tr>
      <th>Deployed On</th>
      <th>URL</th>
    </tr>
    <tr>
      <td>ICP MAINNET</td>
      <td>https://h7t4t-tyaaa-aaaap-abqka-cai.icp0.io
      </td>
    </tr>
    <tr>
      <td>ICP CANDID UI</td>
      <td>https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=hkun6-sqaaa-aaaap-abqjq-cai
</td>
    </tr>
    </table>
</div>
<br><br>

## 🚀 Setting up the project locally

To run the Edu.dev locally, follow these steps:
1. Clone the repository:
 ```bash
 git clone  https://github.com/Vikash-8090-Yadav/IC-CLUB.git
 ```
 2. Navigate to the project directory:
```bash
cd  IC-CLUB
```
3. Node Re-versioning

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

4. Install the dependencies:
```bash
npm install --legacy-peer-deps
```
5. Start the dfx sdk:
```bash
dfx start --background --clean
```
6. Deploy the Canister:
```bash
dfx deploy --network ic
```
6. Access the dApp:
Open your web browser and visit the URL SHOWING IN UR TERMINAL to interact with the IC CLUB

<br>

# Project Gallery

### Login Page

![Screenshot from 2023-11-13 01-12-08](https://github.com/Vikash-8090-Yadav/IC-CLUB/assets/85225156/dd06f841-bbc6-4c95-a15a-1d67dbbd8e36)


## 🛠️Technologies we used

[![Powered by Internet Computer](https://img.shields.io/badge/Powered_by-ICP-3770A0?logo=internet-computer)](https://dfinity.org/)

[![Built with React.js](https://img.shields.io/badge/Built_with-React.js-61DAFB?logo=react)](https://reactjs.org/)

[![Developed in Motoko](https://img.shields.io/badge/Developed_in-Motoko-2196F3?logo=dfinity)](https://sdk.dfinity.org/)

[![Tailwind CSS](https://img.shields.io/badge/Styled_with-Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[![Powered by Ethereum](https://img.shields.io/badge/Powered_by-Ethereum-3C3C3D?logo=ethereum)](https://ethereum.org/)

| Technology        | Description                                                | Official Website                                     |
|-------------------|------------------------------------------------------------|------------------------------------------------------|
| React.js          | JavaScript library for building user interfaces, often used for server-rendered or statically-generated applications | [React.js](https://reactjs.org/)                      |
| Tailwind CSS      | Utility-first CSS framework for building custom designs   | [Tailwind CSS](https://tailwindcss.com/)              |
| Motoko            | Programming language used for smart contract development on the Internet Computer blockchain | [Motoko](https://sdk.dfinity.org/docs/language-guide/motoko.html) |
| ICP Blockchain    | Decentralized blockchain platform for building cross-chain decentralized applications | [Internet Computer (ICP)](https://dfinity.org/)      |


<be>


## 🎥 Video Demo


https://youtu.be/YsY6tG8W108

## 🤝 Contributing

Contributions to Algo-Media are always welcome! If you'd like to contribute, please follow these guidelines:
Fork the repository.

Create a new branch for your feature or bug fix:

```
git checkout -b feature/your-feature-name
```
Commit your changes:

```
git commit -m 'Add some feature'
```
Push the branch:

```
git push origin feature/your-feature-name
```
Open a pull request.

We appreciate your contributions and thank you for helping us improve Algo-Media!

<br >
</div>

## Project Contributors



## 🌐 Socials:




## Project Contributor (Member)

<table>
<tr>
<td align="center"><a href="https://github.com/Vikash-8090-Yadav"><img src="https://avatars.githubusercontent.com/u/85225156?s=400&u=3363e9db42792ae40a18b3119c745930bb85cf47&v=4" width=150px height=150px /></a></br> <h4 style="color:red;">Vikash Kumar Yadav</h4>
<a href="https://www.linkedin.com/in/vikash-kumar-yadav-8090/"><img src="https://mpng.subpng.com/20180324/vhe/kisspng-linkedin-computer-icons-logo-social-networking-ser-facebook-5ab6ebfe5f5397.2333748215219374063905.jpg" width="32px" height="32px"></a>
   </td>
  
   
</div>
<a href="#top">Back to top ⬆️</a>

