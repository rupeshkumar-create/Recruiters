export interface Tool {
  id: string;
  name: string;
  url: string;
  tagline: string;
  content: string;
  categories: string;
  logo: string;
  slug: string;
  featured: boolean;
}

// Local storage key
const TOOLS_STORAGE_KEY = 'ai_staffing_tools';

// All 149 tools from CSV data
export const csvTools: Tool[] = [
  {
    "id": "6",
    "name": "AI Resume Builder by Candidately",
    "url": "https://www.candidately.com/ai-resume-builder",
    "tagline": "Reformat your candidate's resume into a branded PDF or Word file in seconds.",
    "content": "https://docs.google.com/document/d/1cdBK5mgnujv6WydQWCT2WIk1pJyHsq99Nbufw-LqIj0/edit?usp=sharing",
    "categories": "Candidate Presentation",
    "logo": "/images/ai-resume-builder-by-candidately.png",
    "slug": "ai-resume-builder-candidately",
    "featured": true
  },
  {
    "id": "7",
    "name": "Client Portal by Candidately",
    "url": "https://www.candidately.com/client-portal",
    "tagline": "Submit candidates via a magic link, allowing client to review and collaborate in one place.",
    "content": "https://docs.google.com/document/d/1jDOQHO0oaldG_jQfk3sPudYZ-qwn3NFwpiAxBrlNlVM/edit?usp=sharing",
    "categories": "Candidate Presentation",
    "logo": "/images/client-portal-by-candidately.jpg",
    "slug": "client-portal-candidately",
    "featured": true
  },
  {
    "id": "8",
    "name": "Talent Marketplace by Candidately",
    "url": "https://www.candidately.com/talent-marketplace",
    "tagline": "Launch a talent marketplace to showcase candidates on your website.",
    "content": "https://docs.google.com/document/d/1pjGaXLeo7oDSi2GGa_nSewAFBBL0C_Ua0C9pRmdyin8/edit?usp=sharing",
    "categories": "Redeployment",
    "logo": "/images/talent-marketplace-by-candidately.jpg",
    "slug": "talent-marketplace-candidately",
    "featured": true
  },
  {
    "id": "9",
    "name": "Glider AI",
    "url": "https://glider.ai/",
    "tagline": "Skills Platform | Make Hiring Fair & Opportunity Accessible!",
    "content": "Glider AI is a leading Skills Validation Platform recognized among the Top 50 AI Software by G2 and honored by SIA as the Most Innovative HR Technology. It empowers employers and staffing firms to screen, assess, interview, and upskill talent with confidence. Trusted by global brands like Intuit, Amazon, and Capital One, Glider ensures talent quality and fit across all roles and industries, from full-time positions to contingent staffing programs. On average, customers experience a 3x increase in placement rates, a 50% reduction in time-to-fill, and a 98% improvement in candidate satisfaction. To learn more, visit Glider AI.",
    "categories": "Interviewing",
    "logo": "/images/glider-ai.jpg",
    "slug": "glider-ai",
    "featured": false
  },
  {
    "id": "10",
    "name": "Vente AI",
    "url": "https://www.vente.ai/",
    "tagline": "Recruiters find more clients in less time, with Vente AI",
    "content": "Vente is the #1 business development platform for recruiters, using AI to surface high-converting client opportunities by analyzing over 20 recruitment-specific datapoints. It identifies hiring managers, reveals pain points in internal TA teams, and delivers job vacancy insights—so you can spec CVs, discover prospects, and win new clients in minutes, not hours.",
    "categories": "Sales & Marketing",
    "logo": "/images/vente-ai.jpg",
    "slug": "venteai",
    "featured": false
  },
  {
    "id": "11",
    "name": "IntelAgree",
    "url": "https://www.intelagree.com/",
    "tagline": "Your Contracts. Evolved.",
    "content": "IntelAgree is an AI-powered Contract Lifecycle Management (CLM) platform designed to help legal teams focus on impactful work instead of busy work. Using advanced machine learning algorithms, IntelAgree reads and understands key terms and clauses in contracts—whether they're your own or third-party documents. The platform streamlines every stage of the contract process, enabling teams to efficiently and automatically create, negotiate, sign, manage, and analyze contracts with ease.",
    "categories": "Sales & Marketing",
    "logo": "/images/intelagree.jpg",
    "slug": "intelagree",
    "featured": false
  },
  {
    "id": "12",
    "name": "interviewstream",
    "url": "https://interviewstream.com/",
    "tagline": "Interviews Simplified. Hiring Transformed. | SOC 2 Type 2 Certified.",
    "content": "interviewstream simplifies the hiring process with a powerful video interviewing and scheduling platform. By streamlining scheduling, enhancing the candidate experience, and reducing time-to-hire, interviewstream allows hiring teams to focus on what matters most—the candidates. Trusted by over 900 organizations, including emerging businesses, midsize companies, large enterprises, colleges, and universities, interviewstream is committed to delivering meaningful results for every client.",
    "categories": "Interviewing",
    "logo": "/images/interviewstream.jpg",
    "slug": "interviewstream",
    "featured": false
  },
  {
    "id": "13",
    "name": "Nebula",
    "url": "https://signup.nebula.io/",
    "tagline": "Connect with a Universe of Talent + Skills and Build Stellar Teams @ Scale.",
    "content": "Nebula is a modern talent management solution that revolutionizes recruitment by eliminating outdated job postings and poor candidate matches. With access to over 180 million professional profiles, its AI-driven platform streamlines the recruiting process, from generating job descriptions to building candidate shortlists. Nebula also features ByeBias™, a patented solution that removes hiring bias, ensuring equitable and accurate hiring decisions every time. Simplify and elevate your recruitment efforts with Nebula’s powerful sourcing and matching technology.",
    "categories": "Sourcing & Search",
    "logo": "/images/nebula.jpg",
    "slug": "nebula",
    "featured": true
  },
  {
    "id": "14",
    "name": "Serra",
    "url": "https://www.serra.io/",
    "tagline": "Your 24/7 AI Recruiter",
    "content": "Serra is an AI recruiter that fully automates candidate sourcing and outreach, finding ideal talent from LinkedIn, GitHub, Crunchbase, and your ATS. Companies hiring Serra skip sourcing entirely and simply get qualified interviews on their calendar.",
    "categories": "Sourcing & Search",
    "logo": "/images/serra.jpg",
    "slug": "serra",
    "featured": false
  },
  {
    "id": "15",
    "name": "GLOZO",
    "url": "https://www.glozo.com/",
    "tagline": "AI Talent Sourcing that actually works",
    "content": "Glozo is an AI-powered recruitment platform built for speed, precision, and real results. We help recruiters find top candidates faster without relying on outdated keyword-matching tools or endless manual screening. Whether you're hiring at scale or need that one perfect fit, Glozo gives you the data-driven edge to hire smarter, not harder.",
    "categories": "Sourcing & Search",
    "logo": "/images/glozo.jpg",
    "slug": "glozo",
    "featured": false
  },
  {
    "id": "16",
    "name": "Adway AB",
    "url": "https://adway.ai/",
    "tagline": "Automated Social Recruitment Marketing.",
    "content": "Adway is redefining talent acquisition by making it simpler, smarter, and more successful. When talent professionals spend more time marketing to candidates than engaging with them, it’s time for a change. That’s why Adway is on a mission to solve the world’s biggest hiring challenges through technology. Our fully automated platform launches on-brand job and employer brand ads across social media the moment a new vacancy is posted in your ATS. What sets us apart is our next-gen software, which continuously learns from your talent pools to optimize candidate experiences and drive one-click applications. Adway empowers TA teams to focus on connecting with great candidates—rather than chasing them or managing campaigns. Our vision is to become the leading talent acquisition tech provider for large enterprises worldwide, delivering smart, unbiased, and fully automated solutions that attract top talent at scale.",
    "categories": "Sourcing & Search",
    "logo": "/images/adway-ab.jpg",
    "slug": "adway-ab",
    "featured": false
  },
  {
    "id": "17",
    "name": "PARQA",
    "url": "https://www.parqa.com/s/",
    "tagline": "Revolutionizing the Staffing Industry Through Technology, Data & Experience Design.",
    "content": "PARQA is a technology solutions consulting firm specializing in helping enterprise-level staffing companies scale and optimize their data and tech stacks. With deep expertise in platforms like Salesforce, PARQA partners with clients to streamline processes and drive better results.",
    "categories": "Implementation Services",
    "logo": "/images/parqa.jpg",
    "slug": "parqa",
    "featured": false
  },
  {
    "id": "18",
    "name": "PitchMe",
    "url": "https://pitchme.co/",
    "tagline": "PitchMe is a data intelligence partner for recruiters who want to improve their performance.",
    "content": "PitchMe equips hiring teams with AI-driven data intelligence to streamline talent discovery and recruitment. Our end-to-end automated solutions reduce time and manual effort, enabling recruiters to focus on strategic tasks while staying within their ATS. From sourcing top candidates to enriching databases and uncovering new opportunities, PitchMe simplifies every step. With a deep focus on actionable insights, we transform disorganized data into clear, intelligent guidance—empowering better hiring decisions through the power of AI and machine learning.",
    "categories": "Sourcing & Search",
    "logo": "/images/pitchme.jpg",
    "slug": "pitchme",
    "featured": false
  },
  {
    "id": "19",
    "name": "PrismHR",
    "url": "https://www.prismhr.com/",
    "tagline": "Leading platform for payroll, benefits, and HR for SMBs.",
    "content": "PrismHR provides powerful software and services that enable PEOs and ASOs to deliver top-tier payroll, benefits, and HR solutions to small and mid-sized businesses. Trusted by over 88,000 organizations and 2.2 million employees, PrismHR processes more than $57 billion in payroll annually. Our platform helps HR outsourcing providers boost productivity and profitability. Learn more at prismhr.com.",
    "categories": "Payroll & Billing",
    "logo": "/images/prismhr.jpg",
    "slug": "prismhr",
    "featured": false
  },
  {
    "id": "20",
    "name": "bobcheck",
    "url": "https://bobcheck.io/",
    "tagline": "Automated platform for revenue assurance and missed fee detection in recruitment.",
    "content": "We provide revenue assurance to recruitment firms worldwide through an automated platform that protects against direct hires and missed fees. Since launching in February 2022, we’ve identified over £1.2 million in lost revenue. With seamless integrations to Bullhorn and JobAdder, and trusted by leading firms, our solution ensures you don’t leave money on the table.",
    "categories": "Compliance Checks",
    "logo": "/images/bobcheck.jpg",
    "slug": "bobcheck",
    "featured": false
  },
  {
    "id": "21",
    "name": "Hinterview",
    "url": "https://hinterview.ai/",
    "tagline": "The Definitive AI Notetaker for agency recruiters.",
    "content": "Recruitment works best when people connect with people—that’s why Hinterview blends human connection with smart technology. Built by recruiters for recruiters, our end-to-end video recruitment platform helps teams boost response rates, streamline processes, and fill roles faster. From video outreach that captures attention to talent delivery tools that shorten hiring cycles and strengthen relationships, Hinterview empowers recruiters to stand out. Trusted by thousands globally, including Harvey Nash, PageGroup, and Allegis Group.",
    "categories": "Interviewing",
    "logo": "/images/hinterview.jpg",
    "slug": "hinterview",
    "featured": false
  },
  {
    "id": "22",
    "name": "Ringover",
    "url": "https://www.ringover.com/",
    "tagline": "AI-powered conversation platform for Staffing, Business Development & Revenue teams.",
    "content": "Ringover equips staffing, recruiting, and revenue-focused teams with a powerful communications suite to drive better client and business development outcomes. Offering calling, texting, video, WhatsApp, transcriptions, analytics, and more, Ringover integrates seamlessly with platforms like Bullhorn, Salesforce, JobAdder, HubSpot, and others. Automatically log conversations, notes, and call summaries directly into your ATS or CRM, and engage contacts with one click. Trusted by over 13,000 customers globally, Ringover helps teams enhance experiences and boost performance.",
    "categories": "Communication",
    "logo": "/images/ringover.jpg",
    "slug": "ringover",
    "featured": false
  },
  {
    "id": "23",
    "name": "Atlas",
    "url": "https://recruitwithatlas.com/",
    "tagline": "Do business, not admin.",
    "content": "Imagine a recruitment platform built from the ground up with the latest generative AI technology, combining your favorite tools into one seamless interface with perfect out-of-the-box integration. With all your mundane tasks automated, you can focus on what matters most. The result? A 50% increase in revenue.",
    "categories": "ATS",
    "logo": "/images/atlas.jpg",
    "slug": "atlas",
    "featured": false
  },
  {
    "id": "24",
    "name": "Recruitnow",
    "url": "https://www.recruitnow.nl/",
    "tagline": "Recruitment Software Specialist - Non-stop Recruitment Innovation.",
    "content": "Our mission is to help staffing, recruitment, and secondment agencies grow faster by becoming future-proof. Our Recruitment Performance Platform™ combines our solutions, Cockpit and Jobsite, to make your agency 100% digital, online, and GDPR-compliant. With Cockpit ATS as the core of the platform, all your manual tasks are automated, allowing you to focus on what truly matters. Jobsite acts as your online business card and employer brand, offering smart search options and an optimized application flow to make it easier for applicants. Companies like Luba, Daaf, Treffer, and Olympia are already benefiting from our platform. Ready to grow?",
    "categories": "ATS",
    "logo": "/images/recruitnow.jpg",
    "slug": "recruitnow",
    "featured": false
  },
  {
    "id": "25",
    "name": "MercuryATS",
    "url": "https://wearemercury.com/",
    "tagline": "Transform your business with CRM, automation, sourcing & analytics on one platform.",
    "content": "Mercury is a leader in digital transformation for the staffing and recruitment industry. By partnering with Mercury, you gain access to a team of professionals dedicated to supporting your digital transformation with cutting-edge, scalable technology designed to empower employees and boost efficiency and productivity. Founded in 2014 by Chris Kendrick and colleagues from a recruiting and technology background, Mercury has earned multiple awards, including the TIARA Talent Tech Award for Innovation (2021 and 2022) and the US TIARA Talent Tech Star Award for Best Talent Tech Company to Work For (2023). From a team of four to over 140 employees across the UK, US, and Australia, Mercury continues to grow. Learn more at wearemercury.com.",
    "categories": "ATS",
    "logo": "/images/mercuryats.jpg",
    "slug": "mercury",
    "featured": false
  },
  {
    "id": "26",
    "name": "Gem",
    "url": "https://www.gem.com/product/ats",
    "tagline": "Simplify hiring while reducing costs.",
    "content": "Gem's comprehensive recruiting platform is designed to meet the diverse needs of modern talent acquisition teams. With seamless integrations for sourcing, CRM, ATS, and advanced analytics, Gem enhances efficiency and productivity. This scalable solution streamlines the recruitment process, enabling users to source talent, nurture relationships, and track applicants with ease. Built-in scheduling and e-signature features eliminate software sprawl, while Gem’s user-friendly interface offers time-saving automation and centralized data to support strategic decisions. With real-time analytics, Gem optimizes processes, improves the candidate experience, and demonstrates ROI, making it an invaluable asset for businesses seeking a unified approach to attracting, engaging, and retaining top talent.",
    "categories": "ATS",
    "logo": "/images/gem.jpg",
    "slug": "gem-ats",
    "featured": false
  },
  {
    "id": "27",
    "name": "Crew",
    "url": "https://crew.work/",
    "tagline": "AI-driven ATS/CRM built for boutique, mid-size recruitment agencies, & executive search.",
    "content": "Crew is a next-gen ATS/CRM designed specifically for recruiting agencies and independent recruiters. With modern sourcing capabilities, advanced automation, and AI integration, Crew simplifies the recruiting process. Deeply integrated with LinkedIn, Crew eliminates the need for tedious copying, pasting, and tab-switching, making your workday more efficient. Key features include 1-click sourcing from LinkedIn, multichannel sequences on autopilot, synchronization of all communications in one place, and easy access to candidate metrics. Crew helps you scale your hiring efforts, allowing you to find and reach top candidates in just two clicks.",
    "categories": "ATS",
    "logo": "/images/crew.jpg",
    "slug": "crew",
    "featured": false
  },
  {
    "id": "28",
    "name": "Apriora",
    "url": "https://www.apriora.ai/",
    "tagline": "Place better candidates faster with your AI recruiting agent.",
    "content": "Hire the best candidates faster with your AI recruiting agent.",
    "categories": "Interviewing",
    "logo": "/images/apriora.jpg",
    "slug": "apriora",
    "featured": false
  },
  {
    "id": "29",
    "name": "hireEZ",
    "url": "https://hireez.com/",
    "tagline": "The Talent Acquisition Platform with Sourcing, CRM, Analytics and Automation.",
    "content": "hireEZ simplifies recruitment and enhances candidate quality with a unified platform for AI sourcing, recruitment CRM, analytics, and automation. Designed to drive enterprise efficiency and scale, hireEZ helps organizations transform their recruitment processes, optimize costs, and improve team efficiency. With powerful integrations and smart automation, hireEZ centralizes recruitment efforts, ensuring a more effective and streamlined hiring process.",
    "categories": "ATS",
    "logo": "/images/hireez.jpg",
    "slug": "hireez",
    "featured": false
  },
  {
    "id": "30",
    "name": "CandidateIQ by Vettd",
    "url": "https://www.vettd.ai/",
    "tagline": "Data quality solutions for staffing firms—boosting performance through better data.",
    "content": "CandidateIQ is the ultimate data quality solution for Bullhorn customers, optimizing, enriching, and managing candidate data to address outdated, incomplete, or inconsistent information. With automated, real-time tools, CandidateIQ ensures your candidate profiles remain up-to-date, while unlocking Bullhorn's AI and search capabilities with enriched data. Customizable workflows, automatic skill updates, and mass data refreshes help improve matching accuracy and recruiter productivity. Specializing in medical staffing, CandidateIQ integrates seamlessly with Bullhorn to save time, reduce costs, and keep your data actionable. Get started with a free data enrichment sample today and transform your recruitment process.",
    "categories": "Sourcing & Search",
    "logo": "/images/candidateiq-by-vettd.jpg",
    "slug": "candidateiq-by-vettd",
    "featured": false
  },
  {
    "id": "31",
    "name": "SourceFlow",
    "url": "https://www.sourceflow.co.uk/",
    "tagline": "SourceFlow’s recruitment websites and marketing tools drive growth for staffing agencies.",
    "content": "SourceFlow is more than just an industry-leading recruitment website design service; it's a comprehensive recruitment marketing platform. We create recruitment websites, career portals, and marketing tools that enhance ROI and provide transparency through advanced data insights. Leading recruitment brands such as NES, Impellam, Source Group International, and SR2 rely on SourceFlow to drive digital transformation and revenue.",
    "categories": "Sales & Marketing",
    "logo": "/images/sourceflow.jpg",
    "slug": "sourceflow",
    "featured": false
  },
  {
    "id": "32",
    "name": "Spark Hire",
    "url": "https://www.sparkhire.com/",
    "tagline": "Spark connections. Hire together. Spark Hire.",
    "content": "Spark Hire’s software helps organizations with 50-500 employees streamline their hiring processes through a people-driven approach. It enables teams to evaluate candidates beyond resumes while automating workflows and tasks to keep hiring efforts on track. Spark Hire offers solutions like Spark Hire Recruit (applicant tracking system) and Spark Hire Meet (automated reference checks, video interviews, and predictive talent assessments). You can tailor Spark Hire to your needs by using Spark Hire Meet on its own or opting for the comprehensive hiring experience with Spark Hire Recruit, which includes video interviewing and assessments.",
    "categories": "Interviewing",
    "logo": "/images/spark-hire.jpg",
    "slug": "spark-hire",
    "featured": false
  },
  {
    "id": "33",
    "name": "Staffing Engine",
    "url": "https://staffingengine.ai/",
    "tagline": "The first Recruiting Acceleration™ AI that helps staffing firms place more candidates.",
    "content": "Staffing Engine is the world’s first Recruiting Acceleration™ AI Platform, designed to revolutionize the staffing industry by integrating AI across the entire staffing tech stack. By combining award-winning conversational AI with the latest generative AI, staffing firms can operate 24/7, place more candidates, and drive accelerated growth.",
    "categories": "Sales & Marketing",
    "logo": "/images/staffing-engine.jpg",
    "slug": "staffing-engine",
    "featured": false
  },
  {
    "id": "34",
    "name": "Odro",
    "url": "https://www.odro.co.uk/",
    "tagline": "Humanise the Hiring Experience at Scale.",
    "content": "Our powerful video recruitment software is designed to help recruitment agencies humanize the hiring experience at scale. Thousands of forward-thinking recruiters worldwide are already utilizing our leading solution to grow their businesses and enhance their recruitment processes.",
    "categories": "Interviewing",
    "logo": "/images/odro.jpg",
    "slug": "odro",
    "featured": false
  },
  {
    "id": "35",
    "name": "HireAra",
    "url": "https://www.hireara.ai/",
    "tagline": "We make your candidates and your brand stand out.",
    "content": "Our platform is dedicated to enhancing Candidate Presentation, because we understand that your candidates are your product. We help both you and your candidates stand out with AI-powered solutions, making their presentation as impactful as possible. Part of the #RecOS powered by The Access Group.",
    "categories": "Candidate Presentation",
    "logo": "/images/hireara.jpg",
    "slug": "hireara",
    "featured": false
  },
  {
    "id": "36",
    "name": "VXT",
    "url": "https://www.vxt.ai/",
    "tagline": "Fully integrated VoIP phone system for lawyers, accountants and recruiters.",
    "content": "VXT simplifies managing both internal and external communications as a cloud-based platform. In just three years, VXT has facilitated over 4 million calls, helping professionals streamline their communication processes. With powerful integrations to popular CRMs, VXT automates administrative tasks, enhancing client experiences. Founded in New Zealand, VXT has become a top workplace, earning a spot in the Matchstiq Top 50 and 100 companies to work for in 2021, 2022, and 2023. With thousands of users worldwide, VXT continues to empower organizations globally, from London to Sydney and beyond.",
    "categories": "Communication",
    "logo": "/images/vxt.jpg",
    "slug": "vxt",
    "featured": false
  },
  {
    "id": "37",
    "name": "VONQ",
    "url": "https://www.vonq.com/",
    "tagline": "Hire Smarter. Faster.",
    "content": "VONQ transforms recruitment advertising for enterprises and staffing agencies by using AI-driven technology, deep ATS integrations, and expertise to deliver high-quality candidates while enhancing employer brands. Trusted by over 1,000 leading companies, including 25+ Global Fortune 500 firms, VONQ simplifies job ad posting and helps organizations quickly reach the right talent, either through their applicant management system or directly. With access to over 100 ATS and HCM platforms, VONQ supports talent acquisition teams across the US and EU. The platform leverages a global media channel network, programmatic advertising, data-driven insights, and expert recruitment marketing, earning recognition as a Strategic Leader in the 2024 Fosway 9-Grid™ for Talent Acquisition.",
    "categories": "Sourcing & Search",
    "logo": "/images/vonq.jpg",
    "slug": "vonq",
    "featured": false
  },
  {
    "id": "38",
    "name": "Devyce",
    "url": "https://devyce.com/",
    "tagline": "The smarter phone system for the future of work. (YC S22)",
    "content": "At Devyce, we're revolutionizing the phone system to create a secure, collaborative experience for SMEs. Our mission is to eliminate the need for work mobile handsets and legacy landline telephones in offices, offering businesses a simpler, more efficient communication solution. We bring the next-generation phone system to businesses looking to streamline workforce management and enhance the overall phone experience.",
    "categories": "Communication",
    "logo": "/images/devyce.jpg",
    "slug": "devyce",
    "featured": false
  },
  {
    "id": "39",
    "name": "Menemsha Group",
    "url": "https://www.menemshagroup.com/",
    "tagline": "Making sales and recruiting behaviors scalable for staffing organizations.",
    "content": "We are leading the revenue enablement revolution by empowering staffing and recruiting firms with the tools and strategies needed to make revenue growth predictable. To increase team quota attainment and scale growth, we offer a comprehensive suite of innovative tools, industry-specific content, playbooks, and modern learning methods, including mobile deployment, video-centered learning, microlearning for better attention and retention, experiential learning certifications, AI insights and feedback, automated spaced reinforcement, and conversational intelligence.",
    "categories": "Sales & Marketing",
    "logo": "/images/menemsha-group.jpg",
    "slug": "menemsha-group",
    "featured": false
  },
  {
    "id": "40",
    "name": "LogicMelon",
    "url": "https://logicmelon.com/",
    "tagline": "Award-winning recruitment software to find, attract, and hire your way.",
    "content": "We are LogicMelon, your trusted partner for job posting, ATS, and CRM software. Our comprehensive solutions are designed to meet all your recruitment and candidate experience needs, offering everything from job posting and ATS functionality to CRM tools that streamline your workflow and boost efficiency.",
    "categories": "Sourcing & Search",
    "logo": "/images/logicmelon.jpg",
    "slug": "logicmelon",
    "featured": false
  },
  {
    "id": "41",
    "name": "Vonage",
    "url": "https://www.vonage.com/",
    "tagline": "Communications APIs. Unified Communications. Contact Centers. Now we're talking.",
    "content": "At Vonage, we’re transforming communications to be more flexible, intelligent, and personal, helping enterprises stay ahead in an ever-changing world. We offer unified communications, contact centers, and programmable communications APIs, all built on the world’s most adaptable cloud communications platform. Founded in 2001 and acquired by Ericsson in 2022, Vonage is headquartered in Holmdel, New Jersey. Join the conversation and share your feedback, while we maintain the right to remove offensive, abusive, or irrelevant content.",
    "categories": "Communication",
    "logo": "/images/vonage.jpg",
    "slug": "vonage",
    "featured": false
  },
  {
    "id": "42",
    "name": "Recruitics",
    "url": "https://www.recruitics.com/",
    "tagline": "Recruitics is your all-in-one, AI-powered recruitment marketing platform.",
    "content": "Recruitics is the platform that connects you to quality talent, whether you’re targeting specialized roles, streamlining candidate engagement, or measuring programmatic performance. When finding the right talent feels impossible and unqualified applications flood your inbox, our platform shines. Combining intelligent targeting, smart filtering, and automated optimization, Recruitics makes every step of your hiring process more effective. With a holistic approach to talent acquisition, we tackle every challenge at each stage.",
    "categories": "Sourcing & Search",
    "logo": "/images/recruitics.jpg",
    "slug": "recruitics",
    "featured": false
  },
  {
    "id": "43",
    "name": "Wave",
    "url": "https://wave-rs.co.uk/",
    "tagline": "The candidate attraction solution for recruitment agencies.",
    "content": "Wave is the ultimate candidate attraction solution for recruitment agencies. Combining innovative technology, data, and human expertise, our all-in-one platform enables agencies to source top-tier candidates quickly and effortlessly. With Wave, you can build and grow a high-performing recruitment website, manage your job board contracts with ease, and say goodbye to recruitment FOMO.",
    "categories": "Sourcing & Search",
    "logo": "/images/wave.jpg",
    "slug": "wave",
    "featured": false
  },
  {
    "id": "44",
    "name": "Quil",
    "url": "https://quil.ai/",
    "tagline": "The #1 AI Platform for Recruiting Agencies.",
    "content": "The #1 AI platform for recruiting agencies, designed to save time and boost efficiency. With automated interview notes, instant ATS updates, and AI-generated candidate submittals, our platform helps agency recruiters save over 8 hours every week. Experience the only AI notetaker built to streamline your recruiting process.",
    "categories": "Interviewing",
    "logo": "/images/quil.jpg",
    "slug": "quil",
    "featured": false
  },
  {
    "id": "45",
    "name": "Alpharun",
    "url": "https://www.alpharun.com/",
    "tagline": "The leading AI phone interview platform.",
    "content": "AlphaRun is the next-generation AI phone interview platform designed to help you hire at unprecedented speed and scale. Streamline your recruitment process with AI-driven interviews that enhance efficiency and effectiveness. Check out an example call or book a demo at alpharun.com.",
    "categories": "Interviewing",
    "logo": "/images/alpharun.jpg",
    "slug": "alpharun",
    "featured": false
  },
  {
    "id": "46",
    "name": "Woo",
    "url": "https://tech.woo.io/",
    "tagline": "Helping your agency keep track of all candidates and contacts in your ATS.",
    "content": "Woo helps recruiting teams keep their ATS up-to-date by continuously refreshing candidate data, ensuring that it remains accurate and current. By cross-referencing millions of data points, Woo ensures recruiters have fresh data daily, preventing outdated profiles from hindering sourcing efforts and enabling business development teams to capitalize on current and potential opportunities.",
    "categories": "Sourcing & Search",
    "logo": "/images/woo.jpg",
    "slug": "woo",
    "featured": false
  },
  {
    "id": "48",
    "name": "Recruiters don’t need more admin. They need results. SourceWhale helps recruitment teams move faster by engaging candidates and clients",
    "url": "managing every interaction",
    "tagline": "and driving more placements — all in one platform. SourceWhale’s modules automate outreach sequences",
    "content": "meeting summaries",
    "categories": "inbox management",
    "logo": "data validation",
    "slug": "CRM updates and more. It removes friction so recruiters keep momentum without getting bogged down by admin. The result is more time spent actively recruiting—engaging candidates",
    "featured": false
  },
  {
    "id": "49",
    "name": "Classet",
    "url": "https://www.classet.org/",
    "tagline": "Transform your recruitment process with Classet's AI-powered interviews.",
    "content": "Classet automates time-consuming recruiting tasks with voice AI, allowing recruiters to focus on building relationships and helping candidates succeed. Our AI-powered instant interview solution streamlines screening, scheduling, and hiring, enabling faster access to top talent. We use AI not to replace the human touch in recruitment, but to enhance and accelerate it, while ensuring a top-tier candidate experience. Transform your hiring process with Classet today.",
    "categories": "Interviewing",
    "logo": "/images/classet.jpg",
    "slug": "classet",
    "featured": false
  },
  {
    "id": "50",
    "name": "Harmony",
    "url": "https://www.harmonyforstaffing.com/",
    "tagline": "Recruit smarter, not harder with AI agents for staffing.",
    "content": "The hiring process is broken, with recruiters overwhelmed by manual tasks, unqualified applicants, and outdated systems. Harmony changes this by using AI-powered recruiting agents to scan talent pools, screen applications, engage candidates, and schedule interviews, allowing recruiters to focus on what matters most—connecting people to opportunity.",
    "categories": "Interviewing",
    "logo": "/images/harmony.jpg",
    "slug": "harmony",
    "featured": false
  },
  {
    "id": "51",
    "name": "HeyMilo",
    "url": "https://www.heymilo.ai/",
    "tagline": "Reduce high-volume screening from weeks to hours with the best AI interviewer.",
    "content": "",
    "categories": "Interviewing",
    "logo": "/images/heymilo.jpg",
    "slug": "heymilo",
    "featured": false
  },
  {
    "id": "52",
    "name": "Bullhorn",
    "url": "https://www.bullhorn.com/",
    "tagline": "Global staffing software leader, trusted by 10,000+ companies.",
    "content": "For the past 25 years, Bullhorn has dedicated itself to building industry-leading, cloud-based software for the staffing and recruitment industry. Through partnerships with 10,000 customers globally, Bullhorn has built a vast knowledge base of recruitment best practices and deep domain expertise to help firms scale their businesses. Founder-led and headquartered in Boston, Bullhorn employs 1,400 people across 14 countries focused on delivering an incredible customer experience – its core mission.",
    "categories": "ATS",
    "logo": "/images/bullhorn.jpg",
    "slug": "bullhorn",
    "featured": false
  },
  {
    "id": "53",
    "name": "Skillsize",
    "url": "https://www.skillsize.ai/",
    "tagline": "The First AI Workforce Consultant.",
    "content": "At Skillsize, we're revolutionizing workforce consulting with the first AI-driven platform tailored for Private Equity, M&A, and Corporate Leaders. Our AI instantly converts existing workforce data into actionable insights on talent mobility, skills gaps, and efficiency. From evaluating workforce alignment to identifying AI-driven optimization opportunities, we deliver on-demand workforce intelligence at deal speed, helping you optimize talent strategies, identify skills gaps, and improve recruitment and training needs. With no lengthy integrations and manual reporting, Skillsize transforms workforce data into strategic value.",
    "categories": "Pre‑Screening",
    "logo": "/images/skillsize.jpg",
    "slug": "skillsize",
    "featured": false
  },
  {
    "id": "54",
    "name": "Curately AI",
    "url": "https://www.curately.ai/",
    "tagline": "AI-powered, all-in-one hiring platform to help you hire faster, better, cheaper.",
    "content": "We are a full-stack, AI-powered Talent Relationship Management, Direct Sourcing, and High-Volume Hiring platform designed to help you source smarter, build engaged communities, and make the right hires faster. Our platform combines talent CRM, marketing, curation, AI, and analytics, streamlining high-volume hiring with process automation and AI assistants for maximum efficiency. By enhancing recruiter productivity, our platform connects you to top-tier candidates quickly and accurately, with valuable integrations like Workday and Fieldglass to further streamline your talent acquisition process.",
    "categories": "ATS",
    "logo": "/images/curately-ai.jpg",
    "slug": "curately-ai",
    "featured": false
  },
  {
    "id": "55",
    "name": "talentpluto",
    "url": "https://talentpluto.com/",
    "tagline": "The AI headhunter connecting elite tech sales talent with high-growth startups.",
    "content": "Talentpluto is the premier recruitment platform connecting top tech sales professionals with high-growth startups. Our mission is to simplify the hiring process for exceptional talent and innovative companies, ensuring the perfect match every time. Candidates create a single profile to access curated job opportunities and engage with leading startups confidentially. Employers gain exclusive access to pre-vetted, top-tier sales talent ready to drive growth. Our AI-driven approach accelerates hiring, streamlines talent discovery, and enhances the overall experience for both candidates and employers.",
    "categories": "Interviewing",
    "logo": "/images/talentpluto.jpg",
    "slug": "talentpluto",
    "featured": false
  },
  {
    "id": "56",
    "name": "RightMatch AI",
    "url": "https://rightmatch.app/",
    "tagline": "AI-Powered Pre-Screening for Bias-Free, Faster Hiring.",
    "content": "RightMatch AI is revolutionizing the hiring process for fast-growing companies with its AI-powered platform. By automating candidate pre-screening through multi-sensory assessments, including audio, video, and screen recordings, it provides richer, bias-free insights. Designed for HR leaders and talent teams hiring at scale, RightMatch enables faster, fairer, and more consistent hiring decisions, reducing time-to-hire by up to 75%.",
    "categories": "Pre‑Screening",
    "logo": "/images/rightmatch-ai.jpg",
    "slug": "rightmatch-ai",
    "featured": false
  },
  {
    "id": "57",
    "name": "Toro",
    "url": "https://toroinsights.ai/",
    "tagline": "Translating Recruiting Data into Human Insights.",
    "content": "Toro is transforming the staffing industry’s recruitment approach by leveraging data automation and insights to enhance recruiter training, measurement, and growth without adding extra steps to workflows. Built by staffing technology veterans, Toro addresses the challenge of unstructured data that often obscures recruiter-candidate dynamics. By using advanced AI, Toro converts vast amounts of unstructured communication into actionable insights, enabling staffing leaders to replicate top performers' successes and streamline operations. This seamless integration captures every interaction's context, allowing firms to adapt quickly, improve coaching, and increase ROI by focusing on what drives successful placements.",
    "categories": "Analytics",
    "logo": "/images/toro.jpg",
    "slug": "toro",
    "featured": false
  },
  {
    "id": "58",
    "name": "Ashby",
    "url": "https://www.ashbyhq.com/",
    "tagline": "Not just another ATS.",
    "content": "Unlock hiring excellence with Ashby’s all-in-one recruiting platform, designed to empower teams from Seed to IPO. Ashby streamlines the hiring process, making it easier and more efficient for companies of all sizes to attract top talent. With its user-friendly interface and powerful features, Ashby simplifies complex tasks and ensures a seamless hiring experience. By eliminating administrative hurdles, Ashby enables teams to focus on building strong, successful teams and gaining a competitive edge in today’s rapidly evolving recruitment landscape.",
    "categories": "ATS",
    "logo": "/images/ashby.jpg",
    "slug": "ashby",
    "featured": false
  },
  {
    "id": "59",
    "name": "Avature",
    "url": "https://www.avature.net/applicant-tracking-system/",
    "tagline": "Applicant tracking made easier",
    "content": "Avature is a powerful applicant tracking system that streamlines executive, professional, and hourly recruitment with extensive automation, providing businesses full control and visibility. It offers a comprehensive recruitment solution, simplifying recruiter training, centralizing applicant data, and ensuring compliance. With Avature CRM, ATS, and innovative social onboarding technology, users can create a digital recruiting experience. The AI-powered employment portals provide an Amazon-like experience, featuring simplified applications, smart suggestions, and a personalized one-stop shop for candidates. Avature’s customization and matching capabilities help identify top candidates and hidden gems based on skills, experience, and geography.",
    "categories": "ATS",
    "logo": "/images/avature.jpg",
    "slug": "avature",
    "featured": false
  },
  {
    "id": "60",
    "name": "iCIMS Talent Acquisition Suite",
    "url": "https://www.icims.com/talent-acquisition-software/",
    "tagline": "Fully-featured human capital management platform.",
    "content": "The iCIMS Talent Acquisition Suite is a comprehensive HR software designed to boost productivity and streamline processes. It aids in career development, succession planning, and automates onboarding, applicant tracking, and timesheets. This web-based platform enhances attendance, benefits, compensation, compliance, time off, and payroll management. iCIMS also plays a key role in employee recruitment, training, and automates the entire employee lifecycle, helping organizations manage their workforce more efficiently and effectively.",
    "categories": "ATS",
    "logo": "/images/icims-talent-acquisition-suite.jpg",
    "slug": "icims-talent-acquisition-suite",
    "featured": false
  },
  {
    "id": "61",
    "name": "Aclaimant Inc.",
    "url": "https://www.aclaimant.com/",
    "tagline": "Empower your team to boost productivity and reduce risk costs with the RMIS that delivers results.",
    "content": "Aclaimant was founded on the belief that everyone has the right to better manage risk and protect what matters most. As the pioneer of Active Risk Management, Aclaimant helps companies reduce risk costs and improve productivity by empowering every employee to be a risk manager. Through its advanced RMIS capabilities, Aclaimant transforms how organizations manage data, people, and processes in workplace safety, incident and claims management, and analytics. Thousands of safety and risk management professionals trust Aclaimant for better outcomes.",
    "categories": "Compliance Checks",
    "logo": "/images/aclaimant-inc-.jpg",
    "slug": "aclaimant-inc",
    "featured": false
  },
  {
    "id": "62",
    "name": "Allsorter",
    "url": "https://allsorter.com/",
    "tagline": "AI-enhanced resume formatting and recruitment workflow optimization.",
    "content": "Allsorter is a SaaS-based intelligent CV formatting software designed for recruiters, eliminating the frustration of manually optimizing and formatting candidate resumes. By delivering accurate, fast, and consistently branded resumes, Allsorter helps reduce costs, improve data security, and boost brand awareness, allowing you to focus on more value-adding tasks like building talent pipelines and nurturing client relationships.",
    "categories": "Candidate Presentation",
    "logo": "/images/allsorter.jpg",
    "slug": "allsorter",
    "featured": false
  },
  {
    "id": "63",
    "name": "theMatchBox",
    "url": "https://www.thematchbox.ai/",
    "tagline": "Search. Find. Match.",
    "content": "theMatchBox simplifies your HR processes by making candidate and vacancy matching easier than ever. With AI and NLP-driven solutions, it streamlines candidate sourcing from LinkedIn and VDAB, enriches profiles through the Profile Booster, and automates lead generation with tools like Jobdigger and the Virtual Sales Recruiter. Whether you're building your candidate database or matching job ads, theMatchBox helps staffing agencies and HR professionals save time while unlocking more opportunities.",
    "categories": "Parsing & AI Matching",
    "logo": "/images/thematchbox.jpg",
    "slug": "thematchbox",
    "featured": false
  },
  {
    "id": "64",
    "name": "Verified First",
    "url": "https://verifiedfirst.com/",
    "tagline": "Background screening built for speed.",
    "content": "Since 2013, Verified First has been helping organizations streamline their hiring process with fast, compliant, and seamless background screening solutions. With over 150 integrations, we allow HR teams to integrate screening tools directly into their preferred platforms, eliminating long waits and hefty fees. Our award-winning team, dedicated to employee satisfaction, has earned us recognition as one of Idaho's Best Places to Work for six years running. Offering scalable solutions for background checks, drug testing, I-9 & E-Verify, and more, we ensure an efficient, effective hiring process.",
    "categories": "Compliance Checks",
    "logo": "/images/verified-first.jpg",
    "slug": "verified-first",
    "featured": false
  },
  {
    "id": "65",
    "name": "idibu",
    "url": "https://www.idibu.com/",
    "tagline": "Helping recruiters place more candidates, faster!",
    "content": "Our candidate attraction software simplifies job posting and manages all application traffic from platforms like LinkedIn, Indeed, Seek, and other job boards and social media. With integrations to Bullhorn, Vincere, Mercury, Access, and more, we streamline the recruitment workflow, quickly moving candidates into your CRM for efficient processing.",
    "categories": "Sourcing & Search",
    "logo": "/images/idibu.jpg",
    "slug": "idibu",
    "featured": false
  },
  {
    "id": "66",
    "name": "ClearlyRated",
    "url": "https://www.clearlyrated.com/",
    "tagline": "The CX Platform for Service Firms.",
    "content": "ClearlyRated is a leading CX platform tailored for B2B service firms, offering a sophisticated alternative to manual processes and basic survey tools. Our industry-focused solution provides real-time insights into client and employee satisfaction, helping teams anticipate and resolve service issues before they affect customers. With seamless CRM and ATS integrations, we automate the process for a hands-off, always-on view of customer and employee relationships. Our CX benchmarking and online reputation tools also provide tangible proof of a firm's commitment to high-quality service, differentiating them from competitors and strengthening client trust.",
    "categories": "Experience & Reputation",
    "logo": "/images/clearlyrated.jpg",
    "slug": "clearlyrated",
    "featured": false
  },
  {
    "id": "67",
    "name": "Aircall",
    "url": "https://aircall.io/",
    "tagline": "AI-powered platform trusted by 20k+ businesses to unify and automate tasks.",
    "content": "Aircall is a unified communications platform that seamlessly integrates voice, SMS, WhatsApp, and social media into one system, with bi-directional syncing across 100+ business apps. Trusted by over 20,000 businesses globally, our AI-powered platform enhances sales and support by automating call routing, repetitive tasks, and providing actionable insights from every customer interaction. This enables your team to focus on what truly matters—building personalized customer relationships. With Aircall, your tech stack unites, teams excel, and every connection drives growth and customer satisfaction.",
    "categories": "Communication",
    "logo": "/images/aircall.jpg",
    "slug": "aircall",
    "featured": false
  },
  {
    "id": "68",
    "name": "Daxtra Technologies",
    "url": "https://www.daxtra.com/",
    "tagline": "Find the best. Find them fast. Find them first.",
    "content": "Daxtra Technologies is a global leader in high-accuracy, multilingual job and resume parsing, semantic search, matching, and recruitment automation. Our solutions provide a competitive edge in finding top talent while minimizing cost-per-hire. Daxtra seamlessly integrates with existing systems, enabling clients to quickly and intuitively access relevant data across internal and external databases. With offices in the UK, US, Hong Kong, China, Japan, and Australia, Daxtra partners with over 1,500 organizations worldwide, supporting staffing companies, recruitment firms, corporate talent acquisition teams, job boards, and software vendors.",
    "categories": "Parsing & AI Matching",
    "logo": "/images/daxtra-technologies.jpg",
    "slug": "daxtra-technologies",
    "featured": false
  },
  {
    "id": "69",
    "name": "GoHire",
    "url": "https://gohire.io/",
    "tagline": "Built for teams that need to hire now.",
    "content": "Having full control over your hiring strategy is crucial for making the right decisions and finding the best candidates. With a secure, centralized platform, you can store all candidate and hiring data in one place, providing complete visibility across your hiring campaigns. You can also utilize various selection tools, such as screening questions, questionnaires, and evaluations, to assess each candidate and identify the most suitable individuals for the role. By leveraging the right selection tools and securely storing all data, you can ensure informed and effective decision-making, ultimately making the best hiring choices for your organization.",
    "categories": "ATS",
    "logo": "/images/gohire.jpg",
    "slug": "gohire",
    "featured": false
  },
  {
    "id": "70",
    "name": "GR8 People",
    "url": "https://www.gr8people.com/",
    "tagline": "Endless Recruiting Benefits.",
    "content": "GR8 People is a powerful recruiting software designed to transform how organizations attract and manage talent. This enterprise-ready platform integrates key components such as an Applicant Tracking System (ATS), Customer Relationship Management (CRM) tools, a customizable career site, and advanced artificial intelligence. With expert integrations to streamline hiring, GR8 People enables organizations to attract, engage, hire, and retain top talent, ensuring competitiveness in the fast-paced job market. The platform empowers teams to make data-driven decisions, enhance candidate experiences, and build lasting relationships with the best candidates.",
    "categories": "ATS",
    "logo": "/images/gr8-people.jpg",
    "slug": "gr8-people",
    "featured": false
  },
  {
    "id": "71",
    "name": "Hire.Inc",
    "url": "https://www.hire.inc/",
    "tagline": "Smart, Fast, AI-Driven Hiring.",
    "content": "Hire.Inc is a powerful ATS and AI copilot designed for top-tier tech recruiters, streamlining candidate reviews by automating key tasks like interview notes, background checks, and applicant summaries. With AI-driven insights, recruiters can make smarter, data-backed hiring decisions. The platform analyzes interview notes and resumes to generate comprehensive report cards, allowing recruiters to focus on informed decision-making. Its user-friendly interface offers a complete view of each candidate's journey, while seamless integration with video conferencing platforms and advanced AI capabilities ensure thorough, compliant background checks.",
    "categories": "ATS",
    "logo": "/images/hire-inc.jpg",
    "slug": "hireinc",
    "featured": false
  },
  {
    "id": "72",
    "name": "100Hires",
    "url": "https://100hires.com/",
    "tagline": "Make the recruitment process a breeze with 100Hires.",
    "content": "100Hires is a user-friendly software designed to help small businesses streamline their hiring processes, from job postings and interviews to job description updates. It integrates seamlessly with multiple employment boards and features a Chrome extension to simplify applicant sourcing. With a Kanban board for tracking progress, the platform keeps all candidate data organized in one place. Recruiters can also send bulk emails using customizable templates, making communication easier. Additionally, 100Hires helps identify top candidates by analyzing job history and profiles, ensuring efficient recruitment.",
    "categories": "ATS",
    "logo": "/images/100hires.jpg",
    "slug": "100hires",
    "featured": false
  },
  {
    "id": "73",
    "name": "HiringThing",
    "url": "https://www.hiringthing.com/",
    "tagline": "Source top talent, hire fast, do great work.",
    "content": "HiringThing makes each step in the hiring process simple, intuitive, and effective, resulting in calm colleagues, well-staffed teams, and happy clients.Great technology, superior – and fast – implementation, and support like you won’t believe. HiringThing is easy-to-use online software that helps companies hire. When you use it, posting jobs online, accepting resumes and sorting through applicants becomes incredibly easy to manage. It takes just a few minutes to set up, and what you do with the time you'll save sorting, routing, counting and filing is all up to you.",
    "categories": "ATS",
    "logo": "/images/hiringthing.jpg",
    "slug": "hiringthing",
    "featured": false
  },
  {
    "id": "74",
    "name": "TalentBloom Healthcare",
    "url": "https://www.talentbloom.ai/",
    "tagline": "Easy Interviewing for better hiring.",
    "content": "HiringThing streamlines every aspect of the hiring process with its intuitive, easy-to-use online software. Companies can quickly post jobs, accept resumes, and sort through applicants efficiently, saving valuable time. With fast implementation and exceptional support, the platform simplifies tasks like sorting, routing, and filing, allowing businesses to focus on what truly matters—building strong teams and ensuring client satisfaction.",
    "categories": "ATS",
    "logo": "/images/talentbloom-healthcare.jpg",
    "slug": "talentbloom-healthcare",
    "featured": false
  },
  {
    "id": "75",
    "name": "iSmartRecruit",
    "url": "https://www.ismartrecruit.com/",
    "tagline": "A complete staffing solution at your service.",
    "content": "iSmartRecruit is a cloud-based AI recruitment software designed to address the challenges faced by staffing firms, recruitment agencies, executive search firms, and in-house HR teams. With a global presence in over 70 countries and support for 14 languages, including major European languages, iSmartRecruit offers seamless implementation and intuitive automation features. It streamlines the entire recruitment process, from candidate sourcing to onboarding. In 2024, the platform received multiple awards for its ATS, Recruiting CRM, and Executive Search Software, recognizing its commitment to delivering exceptional recruitment solutions.",
    "categories": "ATS",
    "logo": "/images/ismartrecruit.jpg",
    "slug": "ismartrecruit",
    "featured": false
  },
  {
    "id": "76",
    "name": "Jobvite",
    "url": "https://www.jobvite.com/",
    "tagline": "Efficient and effective hiring process.",
    "content": "Jobvite is a comprehensive recruiting software that helps users manage every stage of the recruitment process. It enhances employer branding by enabling the creation of top-tier career websites and mobile-friendly application processes. With valuable insights from its dashboard and reports, Jobvite makes hiring more cost-effective and efficient. The software also offers an applicant tracking system that simplifies onboarding, ensures compliance, and streamlines internal processes. Additionally, Jobvite facilitates communication with both active and passive candidates via text, increasing response rates and accelerating the hiring process, while reducing time spent on unqualified candidates.",
    "categories": "ATS",
    "logo": "/images/jobvite.jpg",
    "slug": "jobvite",
    "featured": false
  },
  {
    "id": "77",
    "name": "Loxo",
    "url": "https://loxo.co/",
    "tagline": "AI-Powered Efficiency, and Enhanced Talent Analytics.",
    "content": "Loxo's Talent Intelligence Platform streamlines the entire recruiting process by integrating ATS, CRM, outbound recruitment, data, and sourcing tools into a single AI-powered solution. Tailored for Executive Search, RPO, in-house teams, and recruiting agencies, Loxo ensures data accuracy and visibility while saving time and reducing costs. The platform features advanced reporting and talent analytics, enabling users to set goals and generate detailed reports with ease. With Loxo, recruiting professionals can focus on building relationships with top talent instead of managing complex processes.",
    "categories": "ATS",
    "logo": "/images/loxo.jpg",
    "slug": "loxo",
    "featured": false
  },
  {
    "id": "78",
    "name": "MyNextHire",
    "url": "https://mynexthire.com/",
    "tagline": "Applicant tracking system with a number of AI driven hiring BOTs.",
    "content": "MyNextHire takes an analytics-first approach to help emerging and enterprise companies quickly and objectively recruit top talent at a lower cost. By focusing on data-driven, agile recruiting methods, we enable you to turn hiring into a competitive advantage. Our platform automates routine hiring activities and, more importantly, identifies process bottlenecks, answering key business questions about your talent acquisition plans.",
    "categories": "ATS",
    "logo": "/images/mynexthire.jpg",
    "slug": "mynexthire",
    "featured": false
  },
  {
    "id": "79",
    "name": "Pitch N Hire",
    "url": "https://www.pitchnhire.com/",
    "tagline": "Revolutionize Your Applicant Tracking.",
    "content": "Pitch N Hire is an ideal tool for hiring the right candidates, offering a comprehensive suite of features to streamline the recruitment process. Powered by advanced AI, it helps recruiters efficiently screen, track, and rate candidates. The career page feature allows companies to receive job applications directly into their Applicant Tracking System (ATS) for in-depth screening, assessment, and interview scheduling. With the ATS software, employers can create a personalized career page that reflects their company culture and values, attracting top talent and enhancing the overall hiring experience.",
    "categories": "ATS",
    "logo": "/images/pitch-n-hire.jpg",
    "slug": "pitch-n-hire",
    "featured": false
  },
  {
    "id": "80",
    "name": "Recruit CRM",
    "url": "https://recruitcrm.io/",
    "tagline": "Best tracking system for recruitment agencies.",
    "content": "Recruit CRM is a user-friendly recruitment platform that combines powerful AI-driven automation with full customization. Its Chrome sourcing extension and advanced search capabilities simplify finding candidates and clients, while features like resume parsing, candidate matching, and GPT integration enhance efficiency. The platform supports over 5000 app integrations and enables no-code automation for even the most complex tasks. Recruit CRM also streamlines communication with automated triggers and personalized bulk emails, and boosts collaboration through hotlists, scheduling tools, and comprehensive dashboards—making the entire hiring process faster, smarter, and more effective.",
    "categories": "ATS",
    "logo": "/images/recruit-crm.jpg",
    "slug": "recruit-crm",
    "featured": false
  },
  {
    "id": "81",
    "name": "Recruiterflow",
    "url": "https://recruiterflow.com/",
    "tagline": "Applicant Tracking Tool for Staffing Agencies.",
    "content": "Recruiterflow is an intuitive recruitment platform that helps manage candidate data right from your inbox. With a drag-and-drop interface, it makes updating profiles effortless, while its built-in recruiting assistant keeps communication with candidates and clients organized and professional. Designed for HR managers and growing teams, Recruiterflow offers visual reports and pipeline insights to streamline hiring and improve the candidate experience—making it easier to make informed, efficient hiring decisions.",
    "categories": "ATS",
    "logo": "/images/recruiterflow.jpg",
    "slug": "recruiterflow",
    "featured": false
  },
  {
    "id": "82",
    "name": "Recruitly",
    "url": "https://recruitly.io/",
    "tagline": "All-in-one agency recruitment software.",
    "content": "Recruitly is a cloud-based recruitment software built for agency recruiters, combining an ATS, CRM, marketing, and job distribution tools into one streamlined platform. It automates key tasks, manages candidate pipelines, and supports client relationships, while its marketing and distribution features help job openings reach a wider audience. Designed to boost productivity and reduce time-to-hire, Recruitly empowers agencies to compete more effectively in today’s fast-paced recruitment landscape.",
    "categories": "ATS",
    "logo": "/images/recruitly.jpg",
    "slug": "recruitly",
    "featured": false
  },
  {
    "id": "83",
    "name": "TalentRecruit",
    "url": "http://talentrecruit.com/",
    "tagline": "Empower the recruiters and upgrade the team.",
    "content": "TalentRecruit is an advanced AI-powered talent acquisition platform designed to help businesses of all sizes build world-class teams. Leveraging data-driven algorithms and powerful machine learning, it identifies and ranks top talent—not just available talent—while streamlining recruitment and onboarding through a personalized, systematic approach. With tools that assist in sourcing, assessing, and engaging candidates, TalentRecruit offers an end-to-end solution for staffing and recruitment firms looking to make smarter, faster, and more effective hiring decisions.",
    "categories": "ATS",
    "logo": "/images/talentrecruit.jpg",
    "slug": "talentrecruit",
    "featured": false
  },
  {
    "id": "84",
    "name": "TargetRecruit",
    "url": "https://targetrecruit.com/",
    "tagline": "Applicant Tracking Solution.",
    "content": "TargetRecruit is a fully customizable, cloud-based Applicant Tracking Solution built to streamline talent acquisition and improve hiring outcomes. Part of a robust ecosystem of integrated apps, it enhances both the speed and quality of hiring while reducing costs. Designed to help recruiters present the best candidates at the right time, TargetRecruit combines powerful ATS capabilities with CRM tools for better client relationships, sales, marketing, and forecasting—all in one unified platform.",
    "categories": "ATS",
    "logo": "/images/targetrecruit.jpg",
    "slug": "targetrecruit",
    "featured": false
  },
  {
    "id": "85",
    "name": "Teamable",
    "url": "https://www.teamable.com/",
    "tagline": "Referral hiring has been made easy.",
    "content": "Teamable is a smart employee referral platform that helps companies scale, manage, and track their referral programs with ease. Its Warm Introduction Platform integrates seamlessly with ATS systems, ensuring referrals are tracked throughout the hiring pipeline without missing a beat. With features like real-time referral incentives, gamification, and diversity-focused hiring, Teamable boosts engagement and improves hiring speed—delivering candidates 55% faster than traditional channels. Backed by strong analytics and dedicated support, it empowers organizations to build inclusive, high-performing teams through the power of referrals.",
    "categories": "ATS",
    "logo": "/images/teamable.jpg",
    "slug": "teamable",
    "featured": false
  },
  {
    "id": "86",
    "name": "VanillaHR",
    "url": "https://www.vanillahr.com/",
    "tagline": "Effective AI Hiring Platform.",
    "content": "VanillaHR is an all-in-one hiring platform that streamlines every stage of the recruitment process—from sourcing and attracting talent to interviewing and hiring. Designed for efficiency and ease, it helps businesses quickly find the right candidates while delivering a seamless experience for applicants. With customizable applicant tracking, intuitive dashboards, and real-time updates, VanillaHR simplifies recruiting for both employers and job seekers. Its data-driven tools empower hiring teams to make informed decisions, saving time and ensuring a professional, branded hiring experience from start to finish.",
    "categories": "ATS",
    "logo": "/images/vanillahr.jpg",
    "slug": "vanillahr",
    "featured": false
  },
  {
    "id": "87",
    "name": "1218 Global",
    "url": "https://1218global.com/",
    "tagline": "Technology Experts for the Staffing Industry.",
    "content": "",
    "categories": "Implementation Services",
    "logo": "/images/1218-global.jpg",
    "slug": "1218-global",
    "featured": false
  },
  {
    "id": "88",
    "name": "HrFlow.ai",
    "url": "https://hrflow.ai/",
    "tagline": "Solving unemployment with AI, one API at a time.",
    "content": "HrFlow.ai is the first AI studio designed to unify, activate, and automate talent and workforce data through a powerful multi-layer AI-powered API. It brings intelligence to HR data by seamlessly connecting various data sources and destinations, helping organizations and vendors streamline operations while ensuring compliance with GDPR, privacy regulations, algorithmic consent, and fairness requirements through built-in features.",
    "categories": "Parsing & AI Matching",
    "logo": "/images/hrflow-ai.jpg",
    "slug": "hrflowai",
    "featured": false
  },
  {
    "id": "89",
    "name": "Actonomy",
    "url": "https://www.actonomy.com/",
    "tagline": "Helping recruiters cut time-to-hire with smart matching and automation.",
    "content": "Actonomy is an AI-powered smart matching platform that uses advanced semantic analysis to connect job opportunities with candidate profiles. It enables faster discovery of both jobs and talent while uncovering career paths in multiple directions, helping recruiters and job seekers explore a broader range of opportunities with greater accuracy.",
    "categories": "Parsing & AI Matching",
    "logo": "/images/actonomy.jpg",
    "slug": "actonomy",
    "featured": false
  },
  {
    "id": "90",
    "name": "Oorwin",
    "url": "https://oorwin.com/",
    "tagline": "AI Powered Talent Intelligence | Recruit, Hire & Manage.",
    "content": "Oorwin is an AI-powered talent management solution that streamlines the sourcing, hiring, and onboarding of talent. By enhancing recruiter productivity and effectiveness, it significantly reduces time-to-hire. The platform also helps organizations engage and develop talent to its full potential. Oorwin seamlessly integrates with existing application software, creating a unified platform to optimize your talent ecosystem.",
    "categories": "ATS",
    "logo": "/images/oorwin.jpg",
    "slug": "oorwin",
    "featured": false
  },
  {
    "id": "91",
    "name": "RecruiterPM",
    "url": "https://recruiterpm.com/",
    "tagline": "Fill Roles Faster.",
    "content": "This ATS/CRM platform for the HR and recruiting industry enables teams to hire faster with a range of built-in features. It offers advanced business intelligence and analytics, automatic calendar scheduling, project management, mass texting and email campaigns, smart semantic candidate sourcing and matching, programmatic job distribution, e-signing, team collaboration, gamification, and more— all without the need for third-party add-ons or app marketplace subscriptions.",
    "categories": "ATS",
    "logo": "/images/recruiterpm.jpg",
    "slug": "recruiterpm",
    "featured": false
  },
  {
    "id": "92",
    "name": "TestTrick",
    "url": "https://www.testtrick.com/",
    "tagline": "The Best Skill Assessment Software.",
    "content": "Are you struggling with time-consuming hiring processes or wasting money on incompetent talent? Testtrick is the ultimate solution to help your business avoid bad hiring decisions. We believe that hiring and assessing top talent should be faster, easier, more convenient, affordable, and reliable. With Testtrick, you gain access to over 400 pre-built tests, a validated high-quality assessment system, an extensive question library, AI-based proctoring to prevent malpractice, and live interviews to save time and hire top talent without the hassle.",
    "categories": "Pre‑Screening",
    "logo": "/images/testtrick.jpg",
    "slug": "testtrick",
    "featured": false
  },
  {
    "id": "93",
    "name": "Nurturebox.ai",
    "url": "https://www.nurturebox.ai/",
    "tagline": "Close Sales 100x Faster! Built for Healthcare Staffing Agencies.",
    "content": "Designed specifically for healthcare staffing agencies, this performance optimization engine streamlines processes and reduces sales cycles from weeks to hours, enabling faster and more efficient hiring.",
    "categories": "Sales & Marketing",
    "logo": "/images/nurturebox-ai.jpg",
    "slug": "nurtureboxai",
    "featured": false
  },
  {
    "id": "94",
    "name": "COGBEE",
    "url": "https://www.cogbee.io/",
    "tagline": "Hybrid Interview Cloud supporting scientific and scalable hiring.",
    "content": "COGBEE is an AI-driven Hybrid Interview Cloud offering AI-enabled Assessment-as-a-Service and Expert-led Interview-as-a-Service. The platform combines science, scale, and speed to help employers identify the best fit for their organization, ensuring recruiters and hiring managers focus on business-critical tasks by avoiding unqualified candidates. COGBEE features pre-built assessments covering over 300 IT skills, on-demand interviewing, AI-driven proctoring and evaluation, a hassle-free candidate experience, and Interview-as-a-Service.",
    "categories": "Pre‑Screening",
    "logo": "/images/cogbee.jpg",
    "slug": "cogbee",
    "featured": false
  },
  {
    "id": "95",
    "name": "Elev8 Assessments",
    "url": "https://www.elev8assessments.com/",
    "tagline": "Elev8 Assessments offers data-driven workforce assessments.",
    "content": "Elev8 Assessments offers high-quality, data-driven evaluations to assess both your current and future workforce. With a focus on providing valuable insights, the platform measures the skills, knowledge, and performance potential of participants across the MENA region.",
    "categories": "Pre‑Screening",
    "logo": "/images/elev8-assessments.jpg",
    "slug": "elev8-assessments",
    "featured": false
  },
  {
    "id": "96",
    "name": "Intellohire",
    "url": "https://www.intellohire.com/",
    "tagline": "AI-Powered Intelligent Talent Sourcing Platform.",
    "content": "IntelloHire is an AI-driven SaaS platform designed for recruitment and staffing agencies, headhunting, and executive search firms. Trusted by agencies across India and globally, it helps recruiters streamline candidate sourcing, enhance client interactions, and accelerate placements with an intelligent Applicant Tracking System (ATS). Key features include AI-powered candidate sourcing, automated job sharing and engagement, a client and candidate feedback system, and data-driven insights to optimize hiring strategies. IntelloHire empowers recruitment firms to scale efficiently and stay ahead in the future of hiring.",
    "categories": "ATS",
    "logo": "/images/intellohire.jpg",
    "slug": "intellohire",
    "featured": false
  },
  {
    "id": "97",
    "name": "Enginehire",
    "url": "https://enginehire.io/",
    "tagline": "All-in-one staffing and scheduling software to save time.",
    "content": "Enginehire is an all-in-one, fully customizable business management and automation software tailored for recruiting and staffing companies. It powers leading home care, childcare, and medical staffing agencies, helping them streamline their operations and improve efficiency.",
    "categories": "ATS",
    "logo": "/images/enginehire.jpg",
    "slug": "enginehire",
    "featured": false
  },
  {
    "id": "98",
    "name": "Deverus",
    "url": "https://www.deverus.com/",
    "tagline": "Empowering Background Check Companies with Advanced AI Solutions.",
    "content": "Established in 1998, deverus, Inc., a privately-held company based in Austin, provides high-quality software and SaaS cloud-based solutions to the background screening industry. Specializing in mobile applications, integrations, compliance, automation, security, privacy, and customer support, deverus helps HR departments make critical hiring decisions using data such as criminal records, education and employment verifications, drug testing, and more. Serving over 35,000 businesses and hiring more than 2.5 million employees annually, deverus is a founding member of the National Association of Professional Background Screeners (NAPBS) and has been recognized as a “Best Place to Work” by the Austin Business Journal.",
    "categories": "Compliance Checks",
    "logo": "/images/deverus.jpg",
    "slug": "deverus",
    "featured": false
  },
  {
    "id": "99",
    "name": "Gappeo",
    "url": "https://gappeo.com/",
    "tagline": "Identify skill gaps efficiently!",
    "content": "Gappeo helps you identify the right candidate by evaluating skill levels and recommending the best fit for the job, beyond just tracking annual performance and ROI. With Gappeo, you can test candidates based on specific job roles or skills, and create customized tests to get in-depth reports on their capabilities. Offering access to over 500 scientifically designed tests for more than 1200 job roles, Gappeo covers everything from marketing and sales to technical positions, ensuring a comprehensive solution for hiring the best talent.",
    "categories": "Pre‑Screening",
    "logo": "/images/gappeo.jpg",
    "slug": "gappeo",
    "featured": false
  },
  {
    "id": "100",
    "name": "InterviewHQ",
    "url": "https://interviewhq.ai/",
    "tagline": "Schedule, conduct, and analyze 1000's of interviews in hours with flawless results.",
    "content": "With our platform, you can schedule, conduct, and analyze thousands of interviews in just a few hours, delivering impeccable results every time.",
    "categories": "Interviewing",
    "logo": "/images/interviewhq.jpg",
    "slug": "interviewhq",
    "featured": false
  },
  {
    "id": "101",
    "name": "Hellohire",
    "url": "https://www.tryhellohire.com/",
    "tagline": "Cut hiring time (and cost) by 67% using an AI-powered recruiting assistant. Try it free.",
    "content": "Hellohire is an AI-powered recruiting assistant that streamlines the hiring process by automatically engaging, screening, and scheduling interviews with top candidates in minutes, significantly reducing both time and cost. Try it for free and see the results for yourself.",
    "categories": "Pre‑Screening",
    "logo": "/images/hellohire.jpg",
    "slug": "hellohire",
    "featured": false
  },
  {
    "id": "102",
    "name": "HiPeople",
    "url": "https://www.hipeople.io/",
    "tagline": "Use HiPeople’s AI-powered assessments and reference checks to hire the best talent.",
    "content": "HiPeople's screening toolkit leverages AI-powered assessments and automated reference checks to help hiring teams make better hires in 95% less time. It provides actionable insights into a candidate's job fit and past performance, reducing the risk of bad hires and improving the overall quality of hire.",
    "categories": "Pre‑Screening",
    "logo": "/images/hipeople.jpg",
    "slug": "hipeople",
    "featured": false
  },
  {
    "id": "103",
    "name": "Hirebee.ai",
    "url": "https://hirebee.ai/",
    "tagline": "Rethink recruitment with Hirebee—an AI-powered all-in-one platform.",
    "content": "Hirebee.ai is an AI-powered recruitment and applicant tracking software that elevates recruitment automation with state-of-the-art technology. It streamlines every aspect of the recruitment process, from posting and distributing job vacancies to sending offers to candidates.",
    "categories": "ATS",
    "logo": "/images/hirebee-ai.jpg",
    "slug": "hirebeeai",
    "featured": false
  },
  {
    "id": "104",
    "name": "Jobin.cloud",
    "url": "https://jobin.cloud/",
    "tagline": "All-in-one Recruitment Automation tool with ChatGPT.",
    "content": "Jobin.cloud simplifies and automates the recruitment process with a range of powerful features. It offers multichannel messaging outreach, ChatGPT-integrated message personalization, and automated contact enrichment and profile updates. The platform also supports automatic database migration, cleaning, and de-duplication, while streamlining candidate screening and scoring. Jobin.cloud allows you to apply ideal candidate criteria and search based on location and more. Revolutionize your recruitment efforts with Jobin.cloud’s AI-driven solutions, and discover the benefits through free trials, demos, and informative resources available on their website.",
    "categories": "Sourcing & Search",
    "logo": "https://ui-avatars.com/api/?name=Jobin.cloud&size=200&background=0D8ABC&color=fff&format=png",
    "slug": "jobincloud",
    "featured": false
  },
  {
    "id": "105",
    "name": "Viterbit",
    "url": "https://viterbit.com/",
    "tagline": "The AI Recruiting Platform.",
    "content": "Viterbit helps companies centralize, optimize, and enhance their recruitment processes with a multi-channel platform offering 360º management and automatic candidate validation. Powered by Artificial Intelligence, Viterbit determines the most effective channels for each recruitment process, optimizing time and cost. With a modern design tailored for the digital world, Viterbit provides end-to-end recruitment, ensuring access to the best digital talent for your organization.",
    "categories": "ATS",
    "logo": "/images/viterbit.jpg",
    "slug": "viterbit",
    "featured": false
  },
  {
    "id": "106",
    "name": "Jobma",
    "url": "https://www.jobma.com/",
    "tagline": "Interview Better & Faster with AI.",
    "content": "Jobma is an innovative AI-powered video interviewing platform trusted by companies worldwide. It offers a variety of virtual interviewing tools, including asynchronous and live video interviews, automated scheduling, and coding assessments for technical hiring. Jobma’s AI-driven features, such as automated scoring, proctoring, and transcriptions, help reduce unconscious bias and save time. It seamlessly integrates with popular ATS platforms and over 5,000 apps via Zapier. With SOC 2 Type II certification and compliance with GDPR and CCPA, Jobma ensures top-notch security and privacy. Trusted by over 3,000 customers in more than 50 countries, it is available in 16 languages.",
    "categories": "Interviewing",
    "logo": "/images/jobma.jpg",
    "slug": "jobma",
    "featured": false
  },
  {
    "id": "107",
    "name": "Kredifi",
    "url": "https://kredifi.com/",
    "tagline": "People Information For You.",
    "content": "Kredifi’s mission is to revolutionize background screening by making it personalized, modern, mobile, and globally accessible. The platform offers comprehensive background checks for businesses seeking to hire employees, find tenants, volunteers, care providers, and more. In today’s world, where the workforce is increasingly mobile and contingent, Kredifi simplifies the process of sharing credentials, making it smarter, faster, and more efficient.",
    "categories": "Compliance Checks",
    "logo": "/images/kredifi.jpg",
    "slug": "kredifi",
    "featured": false
  },
  {
    "id": "108",
    "name": "Kyloe",
    "url": "https://www.kyloepartners.com/",
    "tagline": "We deliver creative solutions to optimize your CRM’s potential.",
    "content": "Kyloe, Bullhorn’s longest-standing SI partner, optimizes your CRM to unlock its full potential by offering creative solutions to complex challenges. We enhance data quality, automate documents, provide expert Bullhorn automation support, and build customizations tailored to your needs. Whether you need implementation or a database merge, Kyloe is your trusted partner. Since our establishment in 2015, we have grown to over 70 employees across the UK, US, and Australia, helping more than 950 clients worldwide achieve their goals.",
    "categories": "Implementation Services",
    "logo": "/images/kyloe.jpg",
    "slug": "kyloe",
    "featured": false
  },
  {
    "id": "109",
    "name": "Loxo",
    "url": "https://www.loxo.co/",
    "tagline": "Loxo is the #1 Talent Intelligence Platform and global leader in recruiting software.",
    "content": "Loxo is the leading Talent Intelligence Platform and global recruiting software provider, designed to manage the entire recruitment life cycle through a single system-of-record. Replacing legacy Applicant Tracking Systems, Loxo offers a best-in-class ATS, AI-driven Recruiting CRM, multi-channel outbound campaign tools, and a search engine with access to over 1.2 billion people and millions of organizations. The platform provides verified contact details, including mobile numbers and emails, along with instant AI sourcing, ranking, and matching, all seamlessly integrated into one unified workflow.",
    "categories": "ATS",
    "logo": "/images/loxo.jpg",
    "slug": "loxo",
    "featured": false
  },
  {
    "id": "110",
    "name": "Manatal",
    "url": "https://www.manatal.com/",
    "tagline": "The next generation of AI-powered recruitment software.",
    "content": "Manatal is a next-generation recruitment software designed to streamline and simplify the recruitment process from sourcing to onboarding. Built with the latest technologies, it consolidates all recruitment channels into one intuitive platform, offering AI tools, social media enrichment, and remote team management features. With advanced collaboration tools, a full reporting suite, and much more, Manatal helps businesses hire better and faster, transforming the way you recruit and driving recruitment metrics to new heights.",
    "categories": "ATS",
    "logo": "/images/manatal.jpg",
    "slug": "manatal",
    "featured": false
  },
  {
    "id": "111",
    "name": "Monohire",
    "url": "https://monohire.com/",
    "tagline": "AI Powered Recruitment Software.",
    "content": "Monohire is a one-way video interview software that simplifies the hiring process by allowing recruiters to set up interview questions for candidates to respond to at their convenience. This eliminates the need for scheduling live interviews, enabling companies to review candidate responses at their own pace. It’s an efficient tool for streamlining the initial stages of recruitment, saving valuable time for both recruiters and candidates.",
    "categories": "Pre‑Screening",
    "logo": "/images/monohire.jpg",
    "slug": "monohire",
    "featured": false
  },
  {
    "id": "112",
    "name": "NextCrew",
    "url": "https://www.nextcrew.com/",
    "tagline": "Transform your staffing process to accelerate growth, increase efficiency, and optimize costs.",
    "content": "NextCrew offers a comprehensive, end-to-end staffing platform designed to revolutionize workforce management. Our solution enables companies to effortlessly digitize their processes, enhancing operational efficiency and providing a competitive edge in today’s dynamic business landscape",
    "categories": "ATS",
    "logo": "/images/nextcrew.jpg",
    "slug": "nextcrew",
    "featured": false
  },
  {
    "id": "113",
    "name": "PayFit",
    "url": "https://payfit.com/",
    "tagline": "Payroll and HR made simple. PayFit - the payroll management solution for small businesses.",
    "content": "PayFit simplifies payroll and HR management for small businesses through its automated SaaS platform. Designed to save HR teams and business owners time and money on payroll tasks, PayFit allows them to focus on their employees. Since 2015, PayFit has supported digital HR transformation across Europe, offering a range of evolving features and services. Trusted by over 18,000 businesses in France, Spain, and the United Kingdom, PayFit helps companies like Livestorm, Heetch, and Gymlib manage their payroll efficiently.",
    "categories": "Payroll & Billing",
    "logo": "/images/payfit.jpg",
    "slug": "payfit",
    "featured": false
  },
  {
    "id": "114",
    "name": "Recrew AI",
    "url": "https://www.recrew.ai/",
    "tagline": "Recruitment AI API layer.",
    "content": "Recrew offers a comprehensive suite of API-based solutions that streamline and enhance the recruitment process using advanced AI technology. By leveraging large language models (LLMs), Recrew provides unmatched efficiency and accuracy in resume parsing, job description parsing, candidate search, and recommendation systems, optimizing recruitment for greater success.",
    "categories": "Parsing & AI Matching",
    "logo": "/images/recrew-ai.jpg",
    "slug": "recrew-ai",
    "featured": false
  },
  {
    "id": "115",
    "name": "RecView.ai",
    "url": "https://recview.ai/",
    "tagline": "AI and video tools for recruiters to prospect, transcribe, and streamline hiring.",
    "content": "RecView.ai enhances your CRM with powerful video and AI capabilities, designed for recruiters using JobAdder, Bullhorn, Loxo, and Vincere. Prospect with video, schedule meetings with booking links, record and transcribe calls, and share candidate videos, all while keeping your CRM updated in real-time. Start your 7-day free trial today—no credit card required. It integrates seamlessly with Gmail, Outlook, Zoom, Microsoft Teams, and Google Meet.",
    "categories": "Interviewing",
    "logo": "/images/recview-ai.jpg",
    "slug": "recviewai",
    "featured": false
  },
  {
    "id": "116",
    "name": "Nartio",
    "url": "https://nartio.com/",
    "tagline": "Right Skills. Right People. Right Roles.",
    "content": "Say goodbye to guesswork and make data-driven talent decisions with our AI-powered soft skills assessment platform. It helps identify the best-fit talent for your organization, ensuring more informed and effective hiring choices.",
    "categories": "Pre‑Screening",
    "logo": "/images/nartio.jpg",
    "slug": "nartio",
    "featured": false
  },
  {
    "id": "117",
    "name": "Shazamme",
    "url": "https://www.shazamme.com/",
    "tagline": "Like Canva for recruitment websites.",
    "content": "SHAZAMME builds cutting-edge recruitment, staffing, and career websites that make it easy for you to edit, manage, customize, and grow your brand online. Our integrated tools and services, including marketing dashboards, social posting tools, review technology, SEO, PPC, and strategic consulting, help clients enhance their online presence and attract candidates and clients. With 24/7 support, no lock-in contracts, fair pricing, and evolving technology, we provide everything you need to succeed in online recruiting.",
    "categories": "Sales & Marketing",
    "logo": "/images/shazamme.jpg",
    "slug": "shazamme",
    "featured": false
  },
  {
    "id": "118",
    "name": "Testlify",
    "url": "https://testlify.com/",
    "tagline": "The Finest Talent Assessment Platform.",
    "content": "Testlify is the leading talent assessment platform that helps companies hire the best talent quickly, accurately, and affordably. By automating and streamlining the recruitment process, Testlify allows organizations to identify top candidates 3x faster and reduce time to hire by 82%. Our assessments are designed to be candidate-friendly, with a high completion rate, and remove unconscious bias, ensuring a fair and diverse hiring process. With native ATS integrations and a focus on testing on-the-job skills, Testlify optimizes initial screenings and reduces manual tasks, helping companies build stronger teams with less effort. Try Testlify for free and champion a data-driven HR culture in your organization.",
    "categories": "Pre‑Screening",
    "logo": "/images/testlify.jpg",
    "slug": "testlify",
    "featured": false
  },
  {
    "id": "119",
    "name": "Vincere",
    "url": "https://www.vincere.io/",
    "tagline": "The Recruitment Operating System Purpose-built for Recruitment & Staffing Agencies.",
    "content": "Vincere is a modern Recruitment Operating System designed for recruitment and staffing agencies worldwide. It offers a single platform to streamline front, middle, and back office operations for executive search, perm, contract, and temp businesses. With natively integrated modules from day one, Vincere includes a CRM/ATS, recruitment website CMS, AI-driven analytics, temp and contract scheduling, omni-channel communication, advanced workflow automation, and video interviewing tools. Trusted by over 20,000 recruiters globally, Vincere has been recognized as a top-rated CRM/ATS with multiple accolades, including the 2022 Momentum Leader by G2 Crowd and the 2021 GetApp Category Leader for Recruitment Software.",
    "categories": "ATS",
    "logo": "/images/vincere.jpg",
    "slug": "vincere",
    "featured": false
  },
  {
    "id": "120",
    "name": "Algohire.ai",
    "url": "https://algohire.ai/",
    "tagline": "Where Algorithms meet Ambitions!",
    "content": "Algohire is an AI-powered recruitment platform designed to streamline and enhance the hiring process for staffing and recruitment agencies. Our mission is to save time, improve candidate quality, and deliver faster placements with features like automated resume screening, real-time candidate data management through ResDB, a Talent Scout plugin for seamless sourcing, and customized preliminary screening tests. By eliminating inefficiencies and providing actionable insights, Algohire empowers agencies to scale globally and thrive in a competitive recruitment landscape.",
    "categories": "Pre‑Screening",
    "logo": "/images/algohire-ai.jpg",
    "slug": "algohireai",
    "featured": false
  },
  {
    "id": "121",
    "name": "ATZ CRM",
    "url": "https://atzcrm.com/",
    "tagline": "AI-powered ATS & CRM for recruitment, trusted by recruiters in 20+ countries.",
    "content": "ATZ CRM is a cloud-based recruitment software tailored for the global staffing industry, designed to enhance efficiency and drive growth. With features like AI-powered resume parsing, job matching, seamless candidate sourcing, native LinkedIn and WhatsApp integration, automated scheduling, and customizable platforms, ATZ CRM simplifies and automates the hiring process. It also offers open API and Zapier integrations, advanced search capabilities, and a Client Feedback Portal to improve collaboration. Manage candidates, clients, jobs, deals, and billing all in one platform, transforming your recruitment operations and boosting success at a cost-effective price.",
    "categories": "ATS",
    "logo": "/images/atz-crm.jpg",
    "slug": "atz-crm",
    "featured": false
  },
  {
    "id": "122",
    "name": "Avionté",
    "url": "https://www.avionte.com/",
    "tagline": "The most comprehensive end-to-end solution for staffing.",
    "content": "Since 2005, Avionté has been a leader in enterprise staffing platforms, serving over 1,800 staffing firms across North America. Its cloud-based platform offers a complete front- and back-office ATS, payroll solution, mobile app for talent, and a specialized Vendor Management System (VMS) for managing contingent workforces. By automating the staffing process, Avionté ensures seamless workflows from employer to agency to talent. Processing over $15 billion in payroll, Avionté partners with over 80 industry providers through integrations and APIs. With SOC 2 Type 2 certification for top-tier security, Avionté helps clients grow rapidly, improve recruiter productivity, and enhance profitability.",
    "categories": "ATS",
    "logo": "/images/aviont-.jpg",
    "slug": "aviont",
    "featured": false
  },
  {
    "id": "123",
    "name": "Braintrust",
    "url": "https://www.usebraintrust.com/",
    "tagline": "Braintrust is revolutionizing hiring with Braintrust AIR.",
    "content": "Braintrust is transforming hiring with Braintrust AIR, the world’s first end-to-end AI recruiting platform. Powered by human insights and proprietary data, Braintrust AIR reduces time to hire from months to days, instantly matching companies with pre-vetted candidates and conducting the first round of phone screenings. Trusted by top Fortune 1000 companies like Nestlé, Porsche, Atlassian, Goldman Sachs, and Nike, Braintrust AIR enhances the effectiveness of talent acquisition professionals by 100x and helps companies save hundreds of thousands of dollars in recruiting costs.",
    "categories": "Interviewing",
    "logo": "/images/braintrust.jpg",
    "slug": "braintrust",
    "featured": false
  },
  {
    "id": "124",
    "name": "CallMantra",
    "url": "https://www.callmantra.co/",
    "tagline": "A cloud-based calling and texting software for staffing agencies.",
    "content": "CallMantra is a cloud-based calling and texting software designed to help recruiting teams communicate more effectively and boost productivity. With features like verified calling, power dialing (70+ candidates per hour), and integration with over 30 ATSs, recruiters can connect with 3x more candidates and streamline call and text logging. Recruiting managers benefit from real-time analytics, call monitoring for training, and transcription features. With mobile and desktop apps, CallMantra allows teams to recruit and stay connected anytime, anywhere. Trusted by industry leaders like Robert Half, Spherion, and LGBTQCareers, CallMantra helps staffing companies improve efficiency and drive more placements.",
    "categories": "Communication",
    "logo": "/images/callmantra.jpg",
    "slug": "callmantra",
    "featured": false
  },
  {
    "id": "125",
    "name": "Ceipal ATS",
    "url": "ceipal.com",
    "tagline": "Ceipal uses AI to help staffing and recruiting professionals work smarter.",
    "content": "Ceipal offers AI-powered staffing software designed to help staffing, recruiting, and talent professionals work more efficiently while prioritizing people in their processes. Its advanced technology simplifies the tasks of finding, hiring, and managing talent, enabling teams to focus on building meaningful connections and driving success.",
    "categories": "ATS",
    "logo": "/images/ceipal-ats.jpg",
    "slug": "ceipal-ats",
    "featured": false
  },
  {
    "id": "126",
    "name": "JobDiva",
    "url": "https://www.jobdiva.com/",
    "tagline": "The future with the global leader in Talent Acquisition and ATS.",
    "content": "JobDiva is a global leader in Talent Acquisition, Talent Management, and Applicant Tracking technology, offering an AI-powered SaaS solution for the staffing and recruiting industry. This powerful cloud-based platform combines CRM capabilities, synchronization with major job boards and VMS providers, BI analytics, a mobile app, and the world’s largest resume database to deliver staffing solutions with unmatched speed and precision. With more patent-protected features than any other solution, including the ability to search resumes for skills by years of experience, JobDiva is continually recognized for its innovation and excellence, earning numerous industry awards.",
    "categories": "ATS",
    "logo": "/images/jobdiva.jpg",
    "slug": "jobdiva",
    "featured": false
  },
  {
    "id": "127",
    "name": "RecMan",
    "url": "https://www.recman.io/",
    "tagline": "Our cloud toolbox streamlines workforce management for staffing companies.",
    "content": "Since our launch in 2013, we have helped over 1,000 enterprise-level companies efficiently manage large workforces with our all-in-one, cloud-based SaaS solution. Available in 26 languages, our platform offers a comprehensive suite of modules for CRM, ATS, staffing, recruitment, and business intelligence, setting a new industry standard. Key features include effective pipeline management, streamlined recruitment processes with an intuitive applicant overview, and easy candidate profile sharing. Our RecMan Employee App ensures accurate time logging, while the Business Intelligence module provides key insights for profitability. With integrations for posting job ads on 30+ job portals, managing calendars and emails, and sending invoices synced to systems like Fortnox and Visma, we truly provide an all-in-one solution. Learn more about how we can help elevate your business at RecMan.",
    "categories": "ATS",
    "logo": "/images/recman.jpg",
    "slug": "recman",
    "featured": false
  },
  {
    "id": "128",
    "name": "Roosted",
    "url": "https://www.roostedhr.com/",
    "tagline": "Roosted is AI-driven scheduling for on-demand staff.",
    "content": "RoostedHR is an AI-powered Worker Management System designed specifically for the gig economy, automating the scheduling and payment of your staff to maximize productivity. In an industry where many companies still rely on Excel and handwritten notes to track time and build schedules, RoostedHR eliminates the inefficiencies that cost hundreds of hours and thousands of dollars. With our platform, scheduling workers becomes seamless, saving time and reducing costs while improving overall workforce management.",
    "categories": "Interviewing",
    "logo": "/images/roosted.jpg",
    "slug": "roosted",
    "featured": false
  },
  {
    "id": "129",
    "name": "Whippy",
    "url": "https://www.whippy.ai/",
    "tagline": "The all-in-one SMS, email, and voice platform boosting productivity.",
    "content": "Whippy is a powerful all-in-one SMS, email, and voice platform designed to elevate business productivity through automation and AI. Key features include Team Inbox, Campaigns, Workflow Automations, Sales Sequences, AI Voice, AI Chatbots, and Reviews. By streamlining communication and replacing multiple tools, Whippy empowers businesses to maximize efficiency, enhance customer engagement, and drive growth.",
    "categories": "Communication",
    "logo": "/images/whippy.jpg",
    "slug": "whippy",
    "featured": false
  },
  {
    "id": "130",
    "name": "WorkLLama",
    "url": "https://workllama.com/",
    "tagline": "Total talent acquisition and engagement suite.",
    "content": "WorkLLama is an AI-driven talent acquisition and engagement suite, offering a unified platform for all aspects of talent management, including marketing, acquisition, engagement, scheduling, and more. Our mission is to revolutionize the world of work by fostering meaningful connections between employers, job seekers, and employees.",
    "categories": "ATS",
    "logo": "/images/workllama.jpg",
    "slug": "workllama",
    "featured": false
  },
  {
    "id": "131",
    "name": "WurkNow",
    "url": "https://wurknow.com/",
    "tagline": "AI-Powered Workforce Management Software for Staffing.",
    "content": "WurkNow leverages cutting-edge technologies like artificial intelligence and blockchain to create an ecosystem that enables employees and agencies to collaboratively manage the entire workforce experience—from onboarding and placement to compliance and management—all in one place. Our mission is to generate credible data and build trust through technology, enhancing the Blue-Collar Workforce experience. With over 60 years of combined expertise in staffing, software, and compliance, WurkNow sets a new standard for the industry. By incorporating blockchain technology, we ensure secure, irreversible records and a robust audit trail, offering unparalleled security and problem detection for every user.",
    "categories": "ATS",
    "logo": "/images/wurknow.jpg",
    "slug": "wurknow",
    "featured": false
  },
  {
    "id": "132",
    "name": "Zepply.ai",
    "url": "https://zepply.ai/",
    "tagline": "AI-powered hiring made easy—smarter sourcing, better matches, faster hires.",
    "content": "Zepply.Ai is transforming the way companies discover, attract, and hire talent by harnessing the power of artificial intelligence. As an all-in-one, AI-driven recruitment ecosystem, Zepply enables companies to move beyond traditional applicant tracking systems and embrace a new era of smart, efficient hiring.",
    "categories": "Sourcing & Search",
    "logo": "/images/zepply-ai.jpg",
    "slug": "zepplyai",
    "featured": false
  },
  {
    "id": "133",
    "name": "Endorsed",
    "url": "https://endorsed.com/",
    "tagline": "Find Your Dream Hire In Seconds.",
    "content": "Endorsed is the world's best AI talent search platform, used by the fastest growing companies to ensure they hire top talent as efficiently as possible. Acting as your AI recruiting assistant, it streamlines sourcing and applicant review, helping you find the best candidates with speed and precision.",
    "categories": "Sourcing & Search",
    "logo": "/images/endorsed.jpg",
    "slug": "qndorsed",
    "featured": false
  },
  {
    "id": "134",
    "name": "iLabor360",
    "url": "https://ilabornetwork.com/#",
    "tagline": "Vendor Management System for Staffing Firms.",
    "content": "iLabor360 provides staffing firms with a structured process to manage their third-party vendors, driving more placements and reducing risk. By automating job order distribution and centralizing vendor management, iLabor helps recruiting teams fill more job orders that typically go unfilled. Trusted by top IT recruiting firms like APEX, KForce, and Randstad, iLabor360 optimizes vendor networks, improving candidate submittal speed, compliance, and performance reporting. Built for flexibility, iLabor is cloud-based, ATS-integrated, and offers an open API, streamlining processes, boosting recruiter performance, and enhancing profitability while reducing manual administration.",
    "categories": "Vendor Management System (VMS)",
    "logo": "/images/ilabor360.jpg",
    "slug": "ilabor360",
    "featured": false
  },
  {
    "id": "135",
    "name": "Sense",
    "url": "https://www.sensehq.com/",
    "tagline": "AI-powered Talent Engagement Platform.",
    "content": "Sense is the leading AI-powered Talent Engagement & Automation Platform that transforms the recruitment process by combining personalized, omnichannel candidate experiences with enhanced recruiter efficiency. Trusted by over 1,000 organizations, Sense offers a comprehensive suite of features, including Recruiting Automation, Talent CRM, Campaigns, Candidate Scoring & Matching, AI Chatbot, Text Messaging, Interview Scheduling, and Referrals. With Sense, you can optimize every step of the talent acquisition journey, where advanced technology and intuitive functionality work together seamlessly.",
    "categories": "Redeployment",
    "logo": "/images/sense.jpg",
    "slug": "sense",
    "featured": false
  },
  {
    "id": "136",
    "name": "compleet",
    "url": "https://compleet.com/en/",
    "tagline": "The right employees in the right place at the right time.",
    "content": "The compleet suite is designed to address staff shortages and additional requirements in real time, enabling the efficient hiring of temporary staff in a legally compliant manner while optimizing shift planning. It combines workforce management for internal staff, temporary workers, and freelancers, with vendor management and recruiting, all in a single data cycle. With compleet, you always have visibility into when, where, and on which projects employees are working. Through automation, compleet streamlines recurring operational tasks, closing capacity gaps seamlessly via the software and its partner network. In-house and external personnel are optimally scheduled, making compleet your go-to solution for workforce management, vendor management, and recruiting.",
    "categories": "ATS",
    "logo": "/images/compleet.jpg",
    "slug": "compleet",
    "featured": false
  },
  {
    "id": "137",
    "name": "MONA AI",
    "url": "https://www.mona-ai.de/en",
    "tagline": "Automation software for HR and PDL industries using artificial intelligence!",
    "content": "The leading AI software for automated recruiting with our digital employee Mona.",
    "categories": "Interviewing",
    "logo": "/images/mona-ai.jpg",
    "slug": "monaai",
    "featured": false
  },
  {
    "id": "138",
    "name": "KarmaCheck",
    "url": "https://www.karmacheck.com/",
    "tagline": "Background checks and screenings built for staffing.",
    "content": "KarmaCheck is a leader in modern background checks and screenings for the staffing industry. With powerful APIs, pre-built integrations, a mobile-first candidate experience, and rapid customer service, KarmaCheck delivers accurate background checks faster. Our platform helps customers build trust with candidates quickly, enabling faster placements. Headed by CEO Eric Ly, co-founder of LinkedIn, KarmaCheck is proud to be at the forefront of modernizing background checks, verifications, and OHS services. Stay updated with our latest innovations in screening technology, hiring compliance, and workforce trends.",
    "categories": "Compliance Checks",
    "logo": "/images/karmacheck.jpg",
    "slug": "karmacheck",
    "featured": false
  },
  {
    "id": "139",
    "name": "Great Recruiters",
    "url": "https://greatrecruiters.com/",
    "tagline": "Real-time Experience Management for Recruiters and Staffing Firms.",
    "content": "Great Recruiters is the only candidate experience and reputation management platform designed specifically for recruiters and staffing firms. With Great Recruiters, you can easily capture real-time candidate feedback, enhance recruiter performance, and strengthen your brand reputation. Founded by Adam Conrad after 18 years in the staffing industry, Great Recruiters was created to transform the reputation of the recruiting industry by empowering recruiters to take control of their reputations. The platform provides real-time dashboards, allowing recruiters to receive valuable feedback and compare their performance to competitors, driving continuous improvement.",
    "categories": "Experience & Reputation",
    "logo": "/images/great-recruiters.jpg",
    "slug": "great-recruiters",
    "featured": false
  },
  {
    "id": "140",
    "name": "Sourcr",
    "url": "https://www.sourcr.com/",
    "tagline": "Recruiters: build trust, make more placements.",
    "content": "Sourcr is the leading recruiter reviews and marketing platform, helping recruitment agencies quickly build trust and stand out from the competition. In today's market, your online brand is crucial to your success, as clients and candidates often research you before engaging. With 88% of people trusting online reviews as much as personal recommendations, Sourcr makes collecting and showcasing reviews simple and effective. Trusted by over 5,500 recruiters and 1,500 agencies across APAC, Sourcr helps you attract more clients, candidates, and make more placements through a range of powerful features. Take control of your reputation today at sourcr.com.",
    "categories": "Experience & Reputation",
    "logo": "/images/sourcr.jpg",
    "slug": "sourcr",
    "featured": false
  },
  {
    "id": "141",
    "name": "GLYDE",
    "url": "https://glydetalent.com/",
    "tagline": "Agentic AI approach to post, attract and screen the best candidates",
    "content": "At GLYDE®, we’ve leveraged our firsthand recruiting experience to build an AI-driven platform that automates and personalizes the top of the hiring funnel—replacing manual tasks with data-backed agents that attract, engage, re-engage and screen candidates at scale. Our Attract module ingests openings and automatically optimizes multi-channel advertising; Reach re-ignites relationships with past talent through tailored outreach; and Screen delivers instant, self-service candidate assessments that sync directly to your ATS. The result: up to 300% more qualified candidates, 100% timely feedback and an end to résumé black holes—so your team can focus on the human connections that matter most.",
    "categories": "Pre‑Screening",
    "logo": "/images/glyde.jpg",
    "slug": "glyde",
    "featured": false
  },
  {
    "id": "142",
    "name": "Opus Match",
    "url": "https://www.opusmatch.ai/",
    "tagline": "AI-powered matching + branded mobile experiences for modern staffing firms.",
    "content": "Opus Match is an AI-powered matching and mobile platform built for modern staffing firms, boosting recruiter output and delivering branded experiences through Maestro AI Matching, which surfaces the right talent faster, and fully customizable candidate and client mobile apps that are intuitive and easy to use; trusted by leading staffing organizations, Opus Match enables agencies to operate like digital-first marketplaces while staying true to their brand",
    "categories": "Parsing & AI Matching",
    "logo": "/images/opus-match.jpg",
    "slug": "opusmatch",
    "featured": false
  },
  {
    "id": "143",
    "name": "Boostie",
    "url": "https://boostie.com/",
    "tagline": "Talent marketing software to attract, engage and convert quality applicants.",
    "content": "Boostie is rethinking how talent acquisition teams market jobs by putting the power of AI and your own ATS data at the center of every campaign. Rather than sinking budget into generic job boards—only to rediscover the same candidates, waste spend on fake or unqualified traffic, and remain in the dark about your own metrics—Boostie’s platform delivers a modern marketing toolkit built around three core pillars: Promote, which cuts job-board costs by reigniting interest among existing candidates and extending reach across display and search networks; Capture, which uses light-touch pop-ups to nurture new visitors into a clean, qualified talent pool around the clock; and Apply, which filters out spam and bots, vets applicants, and hands recruiters ready-to-hire leads without forcing you to overhaul your site or swap ATS systems. With Boostie, you finally own the process, unlock the value of your data, and trace every click through to conversion.",
    "categories": "Sales & Marketing",
    "logo": "/images/boostie.jpg",
    "slug": "boostie",
    "featured": false
  },
  {
    "id": "144",
    "name": "Referoo",
    "url": "https://www.referoo.com/",
    "tagline": "The reference checking company.",
    "content": "Referoo is the ultimate reference and background-checking solution, bringing every employment check into a single, integrated platform—order, review, and finalize everything in just a few clicks within your HR or ATS system. Choose the checks you need, from standalone reference checks to full background screening and ID verification, and send them all in one candidate-friendly email to streamline engagement and deliver a winning experience. Dive deep into the details that matter—comprehensive references, identity verification, and background checks—while staying compliant with industry and local regulations, and safeguard data integrity by eliminating the hassle and risk of juggling multiple tools. Join thousands of businesses worldwide who trust Referoo to simplify employment checking, enhance candidate experience, and reduce time to hire—book a demo today.",
    "categories": "Compliance Checks",
    "logo": "/images/referoo.jpg",
    "slug": "referoo",
    "featured": false
  },
  {
    "id": "145",
    "name": "Vervoe",
    "url": "https://vervoe.com/",
    "tagline": "See people do the job, before they get the job.",
    "content": "Vervoe's mission is to make hiring about performance, not background. We help employers make hiring decisions based on how well candidates can actually do the job instead of how good they look on paper. Vervoe replaces the traditional hiring process with skills assessments and gives every candidate an opportunity to showcase their talent by doing job-related tasks. Then, Vervoe uses machine learning models to automatically rank candidates based on how well they perform. Hundreds of companies have used Vervoe to hire top performers in 10% of the time. Our customers don't spend time doing resume or phone screening. Instead, they deploy skills assessments at the top of the hiring funnel and only meet the most suitable candidates after their skills have already been validated.",
    "categories": "Pre‑Screening",
    "logo": "/images/vervoe.jpg",
    "slug": "vervoe",
    "featured": false
  },
  {
    "id": "146",
    "name": "HireData",
    "url": "https://www.hiredata.com/",
    "tagline": "The AI-First Growth Engine for Recruitment",
    "content": "HireData - former: Ratecard - is the recruitment automation platform that helps you improve every day by automating and communicating personally at scale as a staffing agency or recruitment team at a corporate. Are you ready to join? Visit https://hiredata.com/ to check out our product.",
    "categories": "Automation",
    "logo": "/images/hiredata.jpg",
    "slug": "hiredata",
    "featured": false
  },
  {
    "id": "147",
    "name": "Wonderkind",
    "url": "https://www.wonderkind.com/",
    "tagline": "Our Talent Attraction Technology inspires millions of candidates to do the job they really love.",
    "content": "Wonderkind has created an innovative Talent Attraction Technology that automates your social media campaigns that will make job-seekers flock to you. Focus on running your people business and delivering a continuous inflow of candidates to your clients. With Wonderkind, you can easily stay ahead of the competition by attracting and engaging both active and passive candidates while increasing your revenue.",
    "categories": "Sales & Marketing",
    "logo": "/images/wonderkind.jpg",
    "slug": "wonderkind",
    "featured": false
  },
  {
    "id": "148",
    "name": "Maxim",
    "url": "https://meetmaxim.com/",
    "tagline": "Your super assistant in recruitment.",
    "content": "I make recruitment simple, fast, and personal. My smart tools help you effortlessly connect and stay in touch with the right talent, elevating your hiring process to the next level. Whether it’s activating your database or crafting powerful job postings and profiles—I ensure you’re always one step ahead. 𝗥𝗲𝗰𝗿𝘂𝗶𝘁𝗺𝗲𝗻𝘁 𝘄𝗮𝘀 𝗻𝗲𝘃𝗲𝗿 𝘁𝗵𝗶𝘀 𝗽𝗼𝘄𝗲𝗿𝗳𝘂𝗹.",
    "categories": "AI Agent",
    "logo": "/images/maxim.jpg",
    "slug": "maxim",
    "featured": false
  },
  {
    "id": "149",
    "name": "VireUp",
    "url": "https://www.vireup.com/",
    "tagline": "Human Led AI for Recruitment | Transparent, Unbiased and Ethical Job Interviews",
    "content": "VireUp is an AI-powered automated video interview and interview-training platform designed to help recruiters make fast, data-driven, and unbiased hiring decisions while giving candidates a fair opportunity and more rewarding experience; by leveraging advanced Natural Language Processing (NLP), VireUp automatically evaluates how satisfactorily each applicant responds to interview questions against the recruiter’s expectations and provides transparent, individualized feedback—explaining the reasoning behind every evaluation to both recruiters and candidates. Book a demo at https://zcal.co/epazarceviren/30min",
    "categories": "Interviewing",
    "logo": "/images/vireup.jpg",
    "slug": "vireup",
    "featured": false
  },
  {
    "id": "150",
    "name": "Honeit",
    "url": "https://honeit.com/",
    "tagline": "Streamline Scheduling, Screening, Submissions, and Feedback with Honeit's Award-Winning Interview Intelligence Platform.",
    "content": "Honeit’s award-winning talent screening and interview intelligence platform helps recruiters transcribe, summarize, and share interview intelligence to deliver trust, transparency, and authenticity through data-driven communication. In the age of AI, talking to people is one of the most critical and high-value activities in Recruitment, Talent Acquisition, and Hiring. Intake calls with hiring managers and screening calls with candidates are full of valuable human talent insights, soft skills, and information not found on resumes or job descriptions.",
    "categories": "Interviewing",
    "logo": "/images/honeit.jpg",
    "slug": "honeit",
    "featured": false
  },
  {
    "id": "151",
    "name": "The Staffing Company",
    "url": "https://www.thestaffing.company",
    "tagline": "Turn candidates into revenue with The Staffing App, the Next-Gen ATS-CRM for Professional Recruiters",
    "content": "Turn candidates into revenue with The Staffing App, the Next-Gen ATS-CRM for Professional Recruiters : - AI-powered candidate analysis - AI-powered talent pools - Enrich emails and phone numbers - Multi-channel sequences - All your responses in a single inbox - Easily share candidates",
    "categories": "ATS",
    "logo": "/images/the-staffing-company.jpg",
    "slug": "thestaffingcompany",
    "featured": false
  },
  {
    "id": "152",
    "name": "Pasta HR",
    "url": "www.pastahr.com",
    "tagline": "WhatsApp Communication & Application",
    "content": "PastaHR simplifies the recruitment of qualified workers – with the help of chat platforms such as WhatsApp or Instagram. Our AI-supported software solution helps to reach, qualify and hire qualified workers. With PastaHR, companies like Siemens, Coop, Helvetia and Autogrill increase the number of qualified applications by over 60% and reduce time-to-hire by more than two weeks. PastaHR is GDPR-compliant and ISO27001 certified and integrates seamlessly with over 40 applicant management systems (ATS) so that all applications and relevant information are automatically available in the ATS. Results with PastaHR: - More applications- through WhatsApp - Better qualified applications - Reduced Time-to-Hire - Better Candidate Experience",
    "categories": "Communication",
    "logo": "/images/pasta-hr.jpg",
    "slug": "pastahr",
    "featured": false
  },
  {
    "id": "153",
    "name": "VOAI.app",
    "url": "https://voai.app/",
    "tagline": "Built for People, Powered by AI",
    "content": "VOAI.app is an AI-powered voice platform built for people in recruitment, payroll, and other people-first industries, enabling natural, human-like phone conversations at scale. From screening candidates to booking meetings and handling compliance, VOAI’s intelligent voice agents manage high-volume calls with fluency, context, and seamless integration—so you can focus on relationships, not repetitive tasks.",
    "categories": "Communication",
    "logo": "/images/voai-app.jpg",
    "slug": "Voaiapp",
    "featured": false
  },
  {
    "id": "154",
    "name": "Nora AI",
    "url": "https://norahq.com/",
    "tagline": "Interview 1000 candidates by tomorrow",
    "content": "Nora is an AI interviewer built to conduct interviews for recruiters using voice AI and automatically screen candidates. Recruiting just got 100x more easier.",
    "categories": "Interviewing",
    "logo": "/images/nora-ai.jpg",
    "slug": "Noraai",
    "featured": false
  },
  {
    "id": "157",
    "name": "Pin.com - AI Recruiting",
    "url": "https://www.pin.com/",
    "tagline": "AI Optimized Recruitment from First Contact to Scheduled Interviews",
    "content": "Pin helps you find top talent fast, whether you're a recruiter or a founder. Our advanced search tools, ATS integration, and personalized outreach help you quickly connect with those hard-to-find candidates—saving you time and giving you a competitive edge. We streamline the hiring process so you can focus on building your team and growing your business.",
    "categories": "Sourcing & Search",
    "logo": "/images/pin-com-ai-recruiting.jpg",
    "slug": "pin",
    "featured": false
  }
];

// Function to load tools from local storage or use CSV data as fallback
export function loadToolsFromStorage(): Tool[] {
  // Get user submitted tools from localStorage
  let userSubmittedTools: Tool[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user_submitted_tools');
      userSubmittedTools = stored ? JSON.parse(stored) : [];
    } catch {
      userSubmittedTools = [];
    }
  }
  
  // Combine CSV data with user submitted tools
  return [...csvTools, ...userSubmittedTools];
}

// Function to initialize local storage with CSV data (client-side only)
export function initializeLocalStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    const storedTools = localStorage.getItem(TOOLS_STORAGE_KEY);
    if (!storedTools) {
      // Initialize with CSV data if nothing in storage
      localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(csvTools));
    }
  } catch (error) {
    console.error('Error initializing localStorage:', error);
  }
}

// Function to get tools from local storage (client-side only)
export function getToolsFromStorage(): Tool[] {
  if (typeof window === 'undefined') return csvTools;

  try {
    const storedTools = localStorage.getItem(TOOLS_STORAGE_KEY);
    if (storedTools) {
      const parsedTools = JSON.parse(storedTools);
      if (Array.isArray(parsedTools) && parsedTools.length > 0) {
        return parsedTools;
      }
    }
  } catch (error) {
    console.error('Error loading tools from localStorage:', error);
  }

  return csvTools;
}

// Function to save tools to local storage
export function saveToolsToStorage(tools: Tool[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
  } catch (error) {
    console.error('Error saving tools to localStorage:', error);
  }
}

// Function to clear tools from local storage
export function clearToolsFromStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TOOLS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tools from localStorage:', error);
  }
}

// Load tools (consistent for SSR/client rendering)
export const mockTools = loadToolsFromStorage();

// Extract unique categories from tools
export const categories = ['All', ...Array.from(
  new Set(mockTools.map(tool => tool.categories).filter(Boolean))
).sort()];

// Helper function to get tool by ID
export function getToolById(id: string): Tool | undefined {
  // Use csvTools directly for server-side rendering, then client-side will hydrate
  const tools = typeof window === 'undefined' ? csvTools : loadToolsFromStorage();
  return tools.find(tool => tool.id === id);
}

// Helper function to get tools by category
export function getToolsByCategory(category: string): Tool[] {
  if (category === 'All') {
    return mockTools;
  }
  return mockTools.filter(tool => 
    tool.categories.toLowerCase().includes(category.toLowerCase())
  );
}

// Function to refresh tools data (reload from CSV)
export function refreshToolsData(): Tool[] {
  saveToolsToStorage(csvTools);
  return csvTools;
}

// Function to add a new tool
export function addTool(tool: Omit<Tool, 'id'>): Tool {
  const newTool: Tool = {
    ...tool,
    id: Date.now().toString()
  };
  
  const currentTools = loadToolsFromStorage();
  const updatedTools = [...currentTools, newTool];
  saveToolsToStorage(updatedTools);
  
  return newTool;
}

// Function to update a tool
export function updateTool(id: string, updates: Partial<Tool>): Tool | null {
  const currentTools = loadToolsFromStorage();
  const toolIndex = currentTools.findIndex(tool => tool.id === id);
  
  if (toolIndex === -1) return null;
  
  const updatedTool = { ...currentTools[toolIndex], ...updates, id };
  currentTools[toolIndex] = updatedTool;
  saveToolsToStorage(currentTools);
  
  return updatedTool;
}

// Function to delete a tool
export function deleteTool(id: string): boolean {
  const currentTools = loadToolsFromStorage();
  const filteredTools = currentTools.filter(tool => tool.id !== id);
  
  if (filteredTools.length === currentTools.length) return false;
  
  saveToolsToStorage(filteredTools);
  return true;
}

// Function to get featured tools
export function getFeaturedTools(): Tool[] {
  // Always use csvTools for featured tools since that's where featured flags are set
  const featured = csvTools.filter(tool => tool.featured);
  return featured;
}

// Function to get similar tools based on categories
export function getSimilarTools(currentToolId: string, categories: string): Tool[] {
  const tools = typeof window === 'undefined' ? csvTools : loadToolsFromStorage();
  const categoryList = categories.toLowerCase().split(',').map(cat => cat.trim());
  
  return tools
    .filter(tool => {
      if (tool.id === currentToolId) return false;
      const toolCategories = tool.categories.toLowerCase().split(',').map(cat => cat.trim());
      return categoryList.some(category => 
        toolCategories.some(toolCat => toolCat.includes(category) || category.includes(toolCat))
      );
    })
    .slice(0, 6); // Limit to 6 similar tools
}

// Function to toggle featured status of a tool
export function toggleFeaturedStatus(id: string): Tool | null {
  const currentTools = loadToolsFromStorage();
  const toolIndex = currentTools.findIndex(tool => tool.id === id);
  
  if (toolIndex === -1) return null;
  
  const updatedTool = { ...currentTools[toolIndex], featured: !currentTools[toolIndex].featured };
  currentTools[toolIndex] = updatedTool;
  saveToolsToStorage(currentTools);
  
  return updatedTool;
}

// Function to remove a tool from the directory
export function removeToolFromDirectory(id: string): Tool | null {
  const currentTools = loadToolsFromStorage();
  const toolIndex = currentTools.findIndex(tool => tool.id === id);
  
  if (toolIndex === -1) return null;
  
  // In a real implementation, we would update a 'visible' flag or similar
  // For now, we'll just simulate by removing it from the array
  const removedTool = currentTools[toolIndex];
  currentTools.splice(toolIndex, 1);
  saveToolsToStorage(currentTools);
  
  return removedTool;
}

// Function to add a tool back to the directory
export function addToolToDirectory(tool: Tool): Tool | null {
  const currentTools = loadToolsFromStorage();
  
  // Check if tool already exists
  if (currentTools.some(t => t.id === tool.id)) {
    return null;
  }
  
  // Add the tool to the array
  currentTools.push(tool);
  saveToolsToStorage(currentTools);
  
  return tool;
}