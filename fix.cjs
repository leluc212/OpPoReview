const fs = require('fs');

const files = [
    'D:/FPTU/Spring2026/EXE101/OpPoReview/src/pages/auth/RegisterRoleSelection.jsx',
    'D:/FPTU/Spring2026/EXE101/OpPoReview/src/pages/auth/CandidateRegister.jsx'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // The regex will non-greedily match from <<<<<<< HEAD to ======= 
    // and then to >>>>>>> [hash]
    content = content.replace(/<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [0-9a-f]{40}\r?\n/g, '$1');

    content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> [0-9a-f]{40}\n/g, '$1');

    fs.writeFileSync(file, content);
    console.log(`Fixed conflicts in ${file}`);
}
