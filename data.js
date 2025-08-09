const portfolioData = {
    name: "Abhishek Dahal",
    title: "Aspiring Chartered Accountant",
    bio: "I build things for the web, and for the balance sheet.",
    about: [
        "My journey to Chartered Accountancy wasn't a lifelong dream; my passion was initially for coding and web development. After some unexpected detours and a nudge from my family, I found myself at a crossroads. I chose to pursue CA not from initial interest, but with a firm resolve to make the commitment <strong>truly worth my time</strong>.",
        "That decision became my primary motivation. I tackled my studies with a new sense of purpose, and the dedication paid off when I ended up <strong>topping the CAP I exams</strong>. This achievement was a moment of deep personal validation and brought great joy to my family. Today, I'm a driven professional with a unique blend of technical insight, business acumen, and a powerful determination to succeed on my own terms.",
        "When I'm not untangling financial statements, I'm usually conquering languages on Duolingo, absorbing book summaries on Blinkist, or geeking out over MasterClasses on everything from negotiation to the science of sleep. My path hasn't been a straight line, but I've found that's what makes the journey fulfilling."
    ],
    contact: {
        callToAction: "What's Next?",
        title: "Get In Touch",
        description: "I'm always open to discussing new opportunities, creative projects, or ideas. Whether you have a question or just want to say hi, my inbox is always open.",
        email: "theabhishekdahal@gmail.com"
    },
    navigation: [
        { name: "about", href: "#about", type: "internal" },
        { name: "experience", href: "#experience", type: "internal" },
        { name: "education", href: "#education", type: "internal" },
        { name: "blogs", href: "https://blog.yourdomain.com", type: "external" },
        { name: "resume", href: "#", type: "external" }
    ],
    sectionsForScrollspy: ["about", "experience", "education", "awards"],
    socials: [
        { name: "GitHub", url: "#", icon: `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><title>GitHub</title><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>` },
        { name: "LinkedIn", url: "#", icon: `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><title>LinkedIn</title><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>` },
        { name: "Instagram", url: "#", icon: `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><title>Instagram</title><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>` },
        { name: "YouTube", url: "#", icon: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><title>YouTube</title><path d="M22.54 6.42c-.25-1.02-1.01-1.8-2.03-2.05C18.99 4 12 4 12 4s-6.99 0-8.51.37c-1.02.25-1.78 1.03-2.03 2.05C1 8.01 1 12 1 12s0 3.99.46 5.58c.25 1.02 1.01 1.8 2.03 2.05C5.01 20 12 20 12 20s6.99 0 8.51-.37c1.02-.25 1.78-1.03 2.03-2.05C23 15.99 23 12 23 12s0-3.99-.46-5.58zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"></path></svg>` },
        { name: "Duolingo", url: "#", icon: `<img src="https://img.icons8.com/?size=100&id=Ct7ZqgxkV8vF&format=png&color=FFFFFF" class="h-6 w-6" alt="Duolingo icon">`}
    ],
    experience: [
        {
            date: "2019 — 2022",
            title: "Accounting Assistant",
            institution: "Purbanchal Enterprises",
            duties: "Managed books for two VAT-registered shops, handled invoicing in Busy software. Uploaded monthly VAT returns to the IRD and conducted year-end external confirmations.",
            skills: ["Busy 21", "VAT Returns", "Bookkeeping", "Client Communication"]
        },
        {
            date: "2015 — 2021",
            title: "Freelance Magazine Layout Designer",
            institution: "Self-Employed",
            duties: "Led the modernization of a monthly magazine, transitioning it to InDesign. Redesigned the cover and prepared digital versions for publication.",
            skills: ["Adobe InDesign", "Graphic Design", "Typography", "Print Production"]
        }
    ],
    skills: [
        { name: "Excel" }, { name: "Word" }, { name: "PowerPoint" },
        { name: "Busy" }, { name: "InDesign" }, { name: "QuickBooks" },
        { name: "Tally Prime" }, { name: "Financial Reporting" }, { name: "Taxation" },
        { name: "Auditing" }, { name: "Graphic Design" }, { name: "Bookkeeping" }
    ],
    education: [
        {
            date: "Ongoing",
            title: "Chartered Accountancy",
            institution: "Insitute of Chartered Accountants of Nepal",
            duties: "Pursuing the professional CA qualification, focusing on advanced modules in financial reporting, auditing, and corporate law. Currently progressing through CAP-II."
        },
        {
            date: "Ongoing",
            title: "Bachelor's in Business Studies",
            institution: "Shankar Dev Campus",
            duties: "Pursuing a comprehensive undergraduate degree with a focus on core business principles, including management, marketing, finance, and economics."
        },
        {
            date: "2020",
            title: "Plus Two in Science",
            institution: "Capital College and Research Center",
            duties: "Completed higher secondary education with a major in Biology, establishing a strong foundation in scientific principles and analytical thinking."
        },
        {
            date: "2018",
            title: "SEE",
            institution: "Manakamana Secondary School",
            duties: "Led the revival of the school's discontinued yearbook, 'Jharana,' overseeing all aspects from design and content collection to final production. Also designed and developed the official school website using WordPress, enhancing skills in project management, graphic design, and web development."
        }
    ],
    awards: [
        {
            date: "Jan 2025",
            title: "Subash Kumar Jhunjhunwala Gold Medal",
            institution: "Institute of Chartered Accountants of Nepal",
            duties: "For having stood First in the CAP I (Foundation Level) Examination held on June 2024."
        },
        {
            date: "Sep 2024",
            title: "Sabitri Anita Rajbahak Award",
            institution: "The Association of Chartered Accountants of Nepal",
            duties: "Highest Marks In CAP I Examination of Chartered Accountany Held By ICAN on June 2024."
        }
    ],
     footer: {
        inspiredBy: "Brittany Chiang",
        inspiredByUrl: "https://brittanychiang.com/",
        madeWith: "Made with Google AI Studio. Powered by late nights, endless curiosity, and way too much water."
    }
};
