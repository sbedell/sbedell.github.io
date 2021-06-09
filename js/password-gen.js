/**
 * Password generator in JS
 * 
 * Credit to: https://jsfiddle.net/Blender/ERCsD/6/
 * for the original skeleton of this code
 */

function pickCharactersFromString(inputStr, numChars = 0) {
  let chars = "";

  for (let i = 0; i < numChars; i++) {
    chars += inputStr.charAt(Math.floor(Math.random() * inputStr.length));
  }

  return chars;
}

/**
* Shuffle a string, basically implementation of Fisher–Yates shuffle
* Credit to @Christoph: https://stackoverflow.com/a/962890/464744
*/
function shuffleString(inputStr) {
  if (inputStr) {
    let splitString = inputStr.split("");
    let top = splitString.length;
    let tmp, current;

    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = splitString[current];
      splitString[current] = splitString[top];
      splitString[top] = tmp;
    }

    return splitString.join("");
  } else {
    return "";
  }
}

function generateRandomPassword(options) {
  let lowercase = "abcdefghijklmnopqrstuvwxyz";
  let uppercase = lowercase.toUpperCase();
  let numbers = '0123456789';
  let specialChars = "!@#$%^&*-_=+?";

  // const specialCharsExtra = '~!@#$%^&*()_+=-"|\/<>.,?';
  // const trimmedListOfSpecials = "!@#$%*?_-=.:|";
  // const govSpecials = "!@#$*_+";
  
  let allChars = "";
  let password = "";
  let totalOptions = 0;

  if (options.avoidAmbiguous) {
    let myreg = /[l|1|I|o|O|0]+/g;
    // Strip out l, 1, I, O, 0, o:
    numbers = numbers.replace(myreg, "");
    lowercase = lowercase.replace(myreg, "");
    uppercase = uppercase.replace(myreg, "");
    // console.log("Uppercase: ", uppercase);
    // console.log("Lowercase: ", lowercase);
    // console.log("Numbers: ", numbers);
  }

  if (options.useLower) {
    allChars += lowercase;
    password += pickCharactersFromString(lowercase, 1);
    totalOptions++;
  }

  if (options.useUpper) {
    allChars += uppercase;
    password += pickCharactersFromString(uppercase, 1);
    totalOptions++;
  }

  if (options.useNumbers) {
    allChars += numbers;
    password += pickCharactersFromString(numbers, 1);
    totalOptions++;
  }

  if (options.useSpecialChars) {
    allChars += specialChars;
    password += pickCharactersFromString(specialChars, 1);
    totalOptions++;
  }

  // console.log("options: ", options);
  
  let len = 12;
  if (!options.passLength || options.passLength > 99 || options.passLength < 12) {
    // console.error("Warning: Password length under 12 is insecure and over 99 is usually not widely accepted by all systems. Defaulting to length 12.");
    document.getElementById("error-output").innerText = "Warning: Password length under 12 is insecure and over 99 is usually not widely accepted by all systems. Defaulting to length 12.";
  } else {
    len = options.passLength;
    document.getElementById("error-output").innerText = "";
  }
  
  password += pickCharactersFromString(allChars, len - totalOptions);
  // console.log("password pre shuffle: ", password);
  
  return shuffleString(password);
}

function passwordGen() {
  // Clear output sections:
  clearOutputSections();
  
  // use the above values to set an options object, use that to conditionally set the pw values
  let options = {
    passLength: parseInt(document.getElementById("pw-length").value),
    useUpper: document.getElementById("uppercaseCb").checked,
    useLower: document.getElementById("lowercaseCb").checked,
    useNumbers: document.getElementById("numbersCb").checked,
    useSpecialChars: document.getElementById("specialCharsCb").checked,
    avoidAmbiguous: document.getElementById("ambiguous-cb").checked
  };

  let thePassword = generateRandomPassword(options);

  // document.getElementById("password-output").innerText = thePassword;
  document.getElementById("password-box").value = thePassword;
}

async function checkPwnedPasswordsAPI() {
  // reset the output:
  clearOutputSections();

  let password = document.getElementById("password-box").value.trim();
  
  if (!password) { 
    console.warn("Warning: Not checking empty password, please enter a value");
    return;
  }

  // First, hash the password with SHA-1
  let sha1HashedPasswordDigest = await sha1HashAsync(password);

  // console.log("sha1HashedPassword: ", sha1HashedPasswordDigest);
  // console.log(`Checking password '${password}': https://api.pwnedpasswords.com/range/${sha1HashedPasswordDigest.slice(0, 5)}`);

  // Next, search the Have I Been Pwned - PwnedPasswords API for the first 5 chars of the hash digest:
  fetch(`https://api.pwnedpasswords.com/range/${sha1HashedPasswordDigest.slice(0, 5)}`,
    {
      method: "GET",
      headers: {
        'Add-Padding': true
      }
    }
    ).then(res => res.text())
    .then(response => {
      // console.log(response);
      // Do your actual processing in here. Maybe throw it to an external function?
      let match = false;
      let count = 0;
      
      response.split("\n").forEach(line => {
        // console.log(line.slice(0, line.indexOf(":"))); // DEBUG
        
        if (sha1HashedPasswordDigest.slice(5).toUpperCase() == line.slice(0, line.indexOf(":"))) {
          // console.log("[!!] we have a match!!", line); // DEBUG
          count = Number(line.slice(line.indexOf(":") + 1));
          // TODO - Check if count is 0, that's just padding then, throw it out. Although that would be a SHA1 hash collision...
          match = true;
        }
      });

      if (match) {
        document.getElementById("error-output").innerText = `[!] PWNED - This password has been seen ${count} times before. \n
          \"This password has previously appeared in a data breach and should never be used. If you've ever used it anywhere before, change it!\"
          - Troy Hunt`;
      } else {
        document.getElementById("api-output").innerText = `Good news! No Pwnage found! \n
          \"This password wasn't found in any of the Pwned Passwords loaded into Have I Been Pwned. That doesn't necessarily mean it's a good password, merely that it's not indexed on this site.\"
          - Troy Hunt`;
      }
    }).catch(error => {
      console.error("[!] Error: ", error);
    });
}

async function sha1HashAsync(userInput) {
  if (window.isSecureContext) {
    // encode as (utf-8) Uint8Array, then hash it.
    const msgUint8 = new TextEncoder().encode(userInput);
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);

    // Convert buffer to byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert bytes to hex string: (toString(16) is using radix 16)
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}

function clearOutputSections() {
  document.getElementById("api-output").innerText = "";
  document.getElementById("error-output").innerText = "";
}

// function checkResults(apiResponse) {}

document.getElementById("genPassBtn").addEventListener("click", passwordGen);
document.getElementById("check-pw-btn").addEventListener("click", checkPwnedPasswordsAPI);
