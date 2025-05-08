// Ye API ka base URL hai — is link se hum currency exchange data fetch karenge.
// Har currency ka JSON file hota hai jise hum is base URL se access karte hain.
const Base_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Hum sare dropdowns ko select kar rahe hain jahan se user currency choose karega.
// Ye do dropdowns hain: ek "from" (kis se convert karna hai) aur ek "to" (kis mein convert karna hai).
const dropdowns = document.querySelectorAll(".dropdown select");


/// Har dropdown ke liye — sare currency codes (like USD, PKR) add kiye ja rahe hain.
for (let select of dropdowns) {
    for (let currCode in countrylist) {
        // Har currency ke liye ek <option> tag banaya jata hai dropdown ke liye.
        let newOption = document.createElement("option");
        newOption.innerText = currCode;  // Text jo user ko dropdown mein dikhega.
        newOption.value = currCode;      // Actual value jo backend mein use hogi.

        // Default set kar rahe hain:
        // Agar dropdown ka naam "from" hai aur currency "USD" hai, to usay selected karo.
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected"; // USD ko default select bana diya
        }

        // Agar dropdown ka naam "to" hai aur currency "PKR" hai, to usay selected karo.
        else if (select.name === "to" && currCode === "PKR") {
            newOption.selected = "selected"; // PKR ko default select bana diya
        }

        // Final step: option ko dropdown mein insert kar do.
        select.append(newOption);
    }


    // Jab user dropdown mein currency change kare,
    // to us currency ka flag bhi update ho jaye.
    select.addEventListener("change", (e) => {
        updateFlag(e.target); // Flag update karne ka function call
    });
}


// Ye function selected currency ka flag update karta hai.
function updateFlag(element) {
    const currCode = element.value; // Currency code le lo (e.g., USD)
    const countryCode = countrylist[currCode]; // Uska matching country code (e.g., US)

    // Flag image ke liye URL generate kar rahe hain.
    const imageSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    // Jo flag image us dropdown ke sath lagi hai uska src update kar do.
    const img = element.parentElement.querySelector("img");
    img.src = imageSrc;
}

// Ye function conversion logic handle karta hai — rate fetch + amount convert
async function updateExchangeRate() {
    const amountInput = document.querySelector("input"); // Amount input box ko get karo
    let amountVal = amountInput.value; // User ka likha hua amount le lo

    // Agar user ne kuch nahi likha ya 0 likha to hum default 1 use karenge
    if (amountVal === "" || amountVal < 1) {
        amountVal = 1;           // Input box mein bhi 1 dikhado
        amountInput.value = "1"; // UI mein bhi 1 dikhana
    }

    // From aur To currencies ko read kar rahe hain (jo user ne select ki hai)
    const fromCurr = document.querySelector(".from select").value.toLowerCase(); // lowercase because API mein lowercase use hota hai
    const toCurr = document.querySelector(".to select").value.toLowerCase();

    // Final API URL ban gaya jahan se from currency ka data milega
    const URL = `${Base_URL}/${fromCurr}.json`;

    try {
        // URL se data fetch karo — ye async operation hai isliye "await" use kiya
        const response = await fetch(URL);

        // Response ko JSON mein convert kar liya
        const data = await response.json();

        // From currency se To currency ka rate nikal rahe hain
        const rate = data[fromCurr][toCurr];


        // Final amount calculate karo (input * exchange rate)
        const finalAmount = (amountVal * rate).toFixed(2); // Example: 5 * 278 = 1390

        // Screen par result show karo user ko
        document.querySelector(".msg").innerText = 
        `${amountVal} ${fromCurr.toUpperCase()} = ${finalAmount} ${toCurr.toUpperCase()}`;
    
    } catch (error) {
        // Agar API call fail ho jaye, error console aur UI dono par dikhayenge
        console.error("Error fetching data:", error);
        document.querySelector(".msg").innerText = "Error fetching exchange rate.";
    }
}


// Jab page pehli baar load ho, to exchange rate auto calculate ho jaye
window.addEventListener("load", () => {
    updateExchangeRate();
});


// Jab user button par click kare, to conversion function run ho
const btn = document.querySelector("button");
btn.addEventListener("click", (e) => {
    e.preventDefault();     // Page reload hone se bachao (form default behavior)
    updateExchangeRate();   // Function call karo to show result
});


//Concept

//fetch()	           Web API se data lene ka tareeqa
//async/await	       Asynchronous ka matlab: jab tak data aata hai tab tak ruk jao
//try/catch	Error      handle karne ke liye
//DOM Manipulation	   HTML elements (like input, dropdown) ko JS se control karna
