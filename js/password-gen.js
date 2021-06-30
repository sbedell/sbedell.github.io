/**
 * Password generator in JS
 * 
 * Uses JS Math.random for randomly selecting characters for the password.
 * Uses Window.crypto for local SHA-1 Hashing. 
 * Uses Have I Been Pwned API to check if the password has appeared in a data breach before.
 */

document.getElementById("genPassBtn").addEventListener("click", generatePassword);
document.getElementById("check-pw-btn").addEventListener("click", checkPwnedPasswordsAPI);

/**
 * Fires when "Generate Password" Button is clicked.
 * Gets options and user input from the HTML elements, and passes it along 
 * to the actual password generator function. This basically handles all DOM control.
 */
function generatePassword() {
  clearOutputSections();
  
  let options = {
    passLength: parseInt(document.getElementById("pw-length").value),
    useUpper: document.getElementById("uppercaseCb").checked,
    useLower: document.getElementById("lowercaseCb").checked,
    useNumbers: document.getElementById("numbersCb").checked,
    useSpecialChars: document.getElementById("specialCharsCb").checked,
    avoidAmbiguous: document.getElementById("ambiguous-cb").checked
  };

  document.getElementById("password-box").value = generateRandomPassword(options);
}

/**
 * Generate a secure random password using user selections from the HTML checkboxes.
 * 
 * @param {Object} options - Options Object that contains all the user selections from the checkboxes.
 * @returns {String} - Shuffled password.
 */
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
    // Remove l, 1, I, O, 0, o:
    let myreg = /[l|1|I|o|O|0]+/g;
    numbers = numbers.replace(myreg, "");
    lowercase = lowercase.replace(myreg, "");
    uppercase = uppercase.replace(myreg, "");
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
  
  let len = 12;
  if (!options.passLength || options.passLength > 99 || options.passLength < 12) {
    document.getElementById("error-output").textContent = "Warning: Password length under 12 is insecure and over 99 is usually not widely accepted by all systems. Defaulting to length 12.";
  } else {
    len = options.passLength;
    document.getElementById("error-output").textContent = "";
  }
  
  password += pickCharactersFromString(allChars, len - totalOptions);
  // console.log("password pre shuffle: ", password);
  
  return shuffleString(password);
}

/**
 * HTTP GET request to Troy Hunt's Have I Been Pwned API.
 * https://haveibeenpwned.com/API/v3#PwnedPasswords
 * 
 * K-Anonymity and SHA-1 Hashing:
 * https://www.troyhunt.com/ive-just-launched-pwned-passwords-version-2/
 * https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/
 * 
 * Padding:
 * https://www.troyhunt.com/enhancing-pwned-passwords-privacy-with-padding/
 * https://blog.cloudflare.com/pwned-passwords-padding-ft-lava-lamps-and-workers/
 */
async function checkPwnedPasswordsAPI() {
  clearOutputSections();

  let password = document.getElementById("password-box").value.trim();
  
  if (!password) { 
    console.warn("Warning: Please enter a password to check.");
    return;
  }

  // First, hash the password with SHA-1
  let sha1HashedPasswordDigest = await sha1HashAsync(password);

  // Next, search the Have I Been Pwned - PwnedPasswords API for the first 5 chars of the hash digest:
  // console.log(`Checking password '${password}': https://api.pwnedpasswords.com/range/${sha1HashedPasswordDigest.slice(0, 5)}`);
  fetch(`https://api.pwnedpasswords.com/range/${sha1HashedPasswordDigest.slice(0, 5)}`, {
    headers: {
      "Add-Padding": true
    }
  }).then(response => {
    if (response.ok) {
      return response.text();
    } else {
      return Promise.reject({
        status: response.status,
        statusText: response.statusText
      });
    }
  }).then(responseText => {
    checkResponse(responseText, sha1HashedPasswordDigest);
  }).catch(error => {
    console.error("[!] Error: ", error);
  });
}

function checkResponse(response, sha1HashedPasswordDigest) {
  let count = 0;
      
  response.split("\n").forEach(line => {
    if (sha1HashedPasswordDigest.slice(5).toUpperCase() === line.slice(0, line.indexOf(":"))) {
      count = Number(line.slice(line.indexOf(":") + 1));
      // Check if count is 0 -> that's padding values, throw it out. Although that would be a SHA1 hash collision...
      if (count === 0) { console.error("[!] Likely SHA-1 hash collision!!"); }
    }
  });

  if (count) {
    document.getElementById("error-output").textContent = `[!] PWNED - This password has been seen ${count} times before. \n
      \"This password has previously appeared in a data breach and should never be used. If you've ever used it anywhere before, change it!\"
      - Troy Hunt`;
  } else {
    document.getElementById("api-output").textContent = `Good news! No Pwnage found! \n
      \"This password wasn't found in any of the Pwned Passwords loaded into Have I Been Pwned. That doesn't necessarily mean it's a good password, merely that it's not indexed on this site.\"
      - Troy Hunt`;
  }
}

/**
 * Hashes a string (password) using the browser's built in 
 * window.crypto API, using SHA-1 hashing, which is the hashing algorithm 
 * required for the Have I Been Pwned API.
 * 
 * This is based on example code from Mozilla:
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 *  
 * @param {String} userInput - Password to hash.
 * @returns {String} - Hex string of the password hash digest.
 */
async function sha1HashAsync(userInput) {
  if (window.isSecureContext && window.crypto) {
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
  document.getElementById("api-output").textContent = "";
  document.getElementById("error-output").textContent = "";
}

/**
 * Credit to: https://jsfiddle.net/Blender/ERCsD/6/
 * for the original skeleton of this code, the "pick" function.
 * 
 * @param {String} inputStr - String to pick characters from.
 * @param {Number} numChars - amount of characters to pick from the string.
 * @returns {String} - Randomly selected characters. 
 */
function pickCharactersFromString(inputStr, numChars = 0) {
  let chars = "";

  for (let i = 0; i < numChars; i++) {
    chars += inputStr.charAt(Math.floor(Math.random() * inputStr.length));
  }

  return chars;
}

/**
 * Shuffle a string, basically implementation of Fisher–Yates shuffle.
 * Credit to @Christoph: https://stackoverflow.com/a/962890/464744
 *
 * @param {String} inputStr - String to shuffle / randomize.
 * @return {String} - shuffled string.
*/
function shuffleString(inputStr) {
  if (!inputStr) { return ""; }
  
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
}
