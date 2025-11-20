export const templates = [
  {
    id: "blank-document",
    label: "Blank Document",
    imageUrl: "/blank-document.svg",
    initialContent: `
      <div>
        <h1>Untitled Document</h1>
        <p>Start writing here...</p>
      </div>
    `,
  },
  {
    id: "business-letter",
    label: "Business Letter",
    imageUrl: "/business-letter.svg",
    initialContent: `
      <div>
        <p>[Your Name]</p>
        <p>[Your Address]</p>
        <br/>
        <p>[Date]</p>
        <br/>
        <p>[Recipient Name]</p>
        <p>[Company Name]</p>
        <p>[Company Address]</p>
        <br/>
        <p>Dear [Recipient Name],</p>
        <p>...write your business letter content here...</p>
        <br/>
        <p>Sincerely,</p>
        <p>[Your Name]</p>
      </div>
    `,
  },
  {
    id: "cover-letter",
    label: "Cover Letter",
    imageUrl: "/cover-letter.svg",
    initialContent: `
      <div>
        <h1>Cover Letter</h1>
        <p>Dear Hiring Manager,</p>
        <p>...write your cover letter here...</p>
        <br/>
        <p>Sincerely,</p>
        <p>[Your Name]</p>
      </div>
    `,
  },
  {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.svg",
    initialContent: `
      <div>
        <p>[Your Address]</p>
        <p>[City, State ZIP]</p>
        <br/>
        <p>[Date]</p>
        <br/>
        <p>[Recipient Name]</p>
        <p>[Recipient Address]</p>
        <br/>
        <p>Dear [Recipient],</p>
        <p>...write your letter here...</p>
      </div>
    `,
  },
  {
    id: "project-proposal",
    label: "Project Proposal",
    imageUrl: "/project-proposal.svg",
    initialContent: `
      <div>
        <h1>Project Proposal</h1>
        <h2>1. Introduction</h2>
        <p>Describe the project overview...</p>
        <h2>2. Objectives</h2>
        <p>List project goals...</p>
        <h2>3. Timeline</h2>
        <p>Provide estimated timeline...</p>
      </div>
    `,
  },
  {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.svg",
    initialContent: `
      <div>
        <h1>Your Name</h1>
        <p>Email • Phone • Location • LinkedIn</p>
        <h2>Experience</h2>
        <p>[Job Title] – [Company]</p>
        <ul>
          <li>Responsibility or achievement</li>
          <li>Responsibility or achievement</li>
        </ul>

        <h2>Education</h2>
        <p>[Degree] – [Institution]</p>

        <h2>Skills</h2>
        <ul>
          <li>Skill 1</li>
          <li>Skill 2</li>
        </ul>
      </div>
    `,
  },
  {
    id: "software-proposal",
    label: "Software Development Proposal",
    imageUrl: "/software-proposal.svg",
    initialContent: `
      <div>
        <h1>Software Development Proposal</h1>
        <h2>1. Overview</h2>
        <p>Brief description of the software solution...</p>

        <h2>2. Features</h2>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>

        <h2>3. Tech Stack</h2>
        <p>List the technologies used...</p>

        <h2>4. Timeline</h2>
        <p>Estimated timeline for development...</p>
      </div>
    `,
  },
];
