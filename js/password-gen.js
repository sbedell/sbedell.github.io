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

  // if (options.avoidAmbiguous) {
  //   let myreg = /[l|1|I|o|O|0]+/g;
  //    // Strip out l, 1, O, 0 from the allChars string
  //    allChars.replace(myreg, "");
  //    numbers.replace("0", "");
  //    lowercase.replace(myreg, "");
  //    console.log("Uppercase: ", uppercase);
  // }

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
  let passLen = parseInt(document.getElementById("pw-length").value);
  let useUppercase = document.getElementById("uppercaseCb").checked;
  let useLowercase = document.getElementById("lowercaseCb").checked;
  let useNums = document.getElementById("numbersCb").checked;
  let useSpecials = document.getElementById("specialCharsCb").checked;
  
  // use the above values to set an options object, use that to conditionally set the pw values
  let options = {
    passLength: passLen,
    useUpper: useUppercase,
    useLower: useLowercase,
    useNumbers: useNums,
    useSpecialChars: useSpecials
  };

  let thePassword = generateRandomPassword(options);

  document.getElementById("password-output").textContent = thePassword;
}

document.getElementById("genPassBtn").addEventListener("click", passwordGen);