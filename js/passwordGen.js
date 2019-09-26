/**
 * Password generator in JS
 * 
 * Credit to: https://jsfiddle.net/Blender/ERCsD/6/
 * for the original skeleton of this code
 */

// using default parameters for max = min
String.prototype.pick = function(min, max = min) {
  let n = min + Math.floor(Math.random() * (max - min));
  let chars = '';

  for (let i = 0; i < n; i++) {
    chars += this.charAt(Math.floor(Math.random() * this.length));
  }

  return chars;
};

/**
* Shuffle a string, basically implementation of Fisher–Yates shuffle
* Credit to @Christoph: https://stackoverflow.com/a/962890/464744
*/
String.prototype.shuffle = function() {
  let splitString = this.split('');
  let top = splitString.length;
  let tmp, current;

  if (top) {
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = splitString[current];
      splitString[current] = splitString[top];
      splitString[top] = tmp;
    }
  }

  return splitString.join('');
};

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

  // for (opt in options) {
  //   console.log(`${opt}: ${options[opt]}`);
  // }

  // Add lowercase to set of all characters, and pick at least 1 for the pw
  if (options.useLower) {
    allChars += lowercase;
    password += lowercase.pick(1);
    totalOptions++;
  }

  if (options.useUpper) {
    allChars += uppercase;
    password += uppercase.pick(1);
    totalOptions++;
  }

  if (options.useNumbers) {
    allChars += numbers;
    password += numbers.pick(1);
    totalOptions++;
  }

  if (options.useSpecialChars) {
    allChars += specialChars;
    password += specialChars.pick(1);
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

  // console.log(options);
  let len = (options.passLength) ? options.passLength : 8;
  //let password = (lowercase.pick(1) + uppercase.pick(1) + numbers.pick(1) + specialChars.pick(1) + all.pick(len - 4)).shuffle();
  password += allChars.pick(len - totalOptions);
  password = password.shuffle();

  return password;
}

function passwordGen() {
  let passLen = parseInt(document.getElementById("pass-length").value);
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