var candidate = {
  type: 'Full Stack Javascript Developer',
  codeAbilities: [
    'Node.js',
    'Angular.js',
    'Express.js',
    'MongoDB',
    'HTML',
    'CSS'
  ],
  technologyAbilities: [
    'Ecommerce',
    'Digital Marketing Automation',
    'Google Analytics',
    'CRM'
  ],
  personAbilities: [
    'abstract complex ideas into simple concepts',
    'design technology architecture to solve a business problem',
    'work in small groups',
    'communicate with both non-technical and technical colleagues and partners',
    'refactor application code quickly to adapt to changing requirements'
  ],
  personTraits: [
    'open-mindedness',
    'meticulous',
    'self-starting'
  ],
  howToApply: 'submit a POST request to /apply.json with body = {name: "fullname", email: "email", blurbAboutMe: "blurb", linkToResume: "url to resume", linksToProjects: ["link", "link"]}'
};

module.exports = candidate;
