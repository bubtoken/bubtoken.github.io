const DESI = 100000000
const SUN = 1000000
const zeroAddress = "0x167d86A32E0829b9C7B03d44557CD43724bDCa3B"
var mainContract, currentDay
var contractAddress = "0x406b97165b45963F396389Fc8d403683b88CFC52"
var telegram = "https://t.me/BubbleTokenGroup"
var twitter = "https://twitter.com/BubbleToken"
var trcwebsite = "https://bubtoken.github.io/"


//Update Header
$('.Bscscan')[0].innerHTML = '<a href="https://bscscan.com/token/'+contractAddress+'" target="_blank">Contract</a>'
$('.telegram')[0].innerHTML = '<a href="'+telegram+'" target="_blank">Telegram</a>'
$('.bepmenu')[0].innerHTML = '<a href="'+bepwebsite+'" target="_blank" class="menu"><div class="menu__icon"><i data-feather="server"></i> </div><div class="menu__title"> BUB Tokens</div></a>'
$('.telemenu')[0].innerHTML = '<a href="'+telegram+'" target="_blank" class="menu"><div class="menu__icon"><i data-feather="users"></i> </div><div class="menu__title"> Telegram </div></a>'

let user = {
    address: void 0,
    balance: void 0,
    referrer: zeroAddress
}


async function setUpContracts(_address) {
    if (!contractAddress && !_address) return void 0
	try{
		BnbWeb.contract().at(contractAddress || _address, function (error, result) {
			if (!error) {
				mainContract = result;
				contractLoaded()
				console.log("Contract Loaded")
			} else{
				console.error(error);
				setUpContracts()
			}
		});
	}catch(e){
		console.log(e)
		setUpContracts()
	}
}


const loginPromise = new Promise((resolve, reject) => {
        if (window.BnbWeb && window.BnbWeb.ready) {
            resolve(true)
        } else {
            window.addEventListener('load', () => {
                let tbAcc = setInterval(() => {
                    if (window.BnbWeb && window.BnbWeb.ready) resolve(true)
                    clearInterval(tbAcc)
                }, 200)

                setTimeout(() => {
                    clearInterval(tbAcc)
                }, 10000)
            })
        }
    })
    .then(() => {
        console.log("Bnbweb installed and logged in")
        return true
    })
    .catch((err) => {
        console.error('Error while detecting Bnbweb', err)
        return false
    })

loginPromise.then((result) => {
    return new Promise((resolve, reject) => {
        const userAddress = window.BnbWeb.defaultAddress.base58
        if (!userAddress) return resolve(false)

        user.address = userAddress
        updateHeadAddress()
		try{
			setUpContracts()
		}catch(e){
			setUpContracts()
		}
        if ($('.ref-link')[0]) 
			$('.ref-link')[0].value = "https://BUBtoken.github.io/panel/auction.html?ref=" + user.address

        window.addEventListener('load', (event) => {})

        setInterval(() => {
            if (window.BnbWeb && user.address !== window.BnbWeb.defaultAddress.base58) location.reload()
        }, 700)
    })
})

function updateHeadAddress() {
    let p2 = user.address.slice(34 - 3)
    $('.my-acc-add')[0].innerHTML = user.address.slice(0, 3) + "..." + p2
    $('.my-acc-add')[1].innerHTML = user.address.slice(0, 3) + "..." + p2

}

function contractLoaded() {
    if (!user.address) return

    getUserBalance()
    setInterval(() => {
        getUserBalance()
    }, 1000 * 6)

    getCurrentDay()

    let intso = setInterval(() => {
        if (currentDay) {
            clearInterval(intso)

            if (typeof run_Stake === "function") run_Stake()
            if (typeof run_Auction === "function") run_Auction()
        }
    }, 100)
}

function getCurrentDay() {
    mainContract.methods.currentDay().call({
        shouldPollResponse: true
    }).then(res => {
        currentDay = parseInt(res)
    })

    setTimeout(() => {
        getCurrentDay()
    }, 1000 * 60 * 7)
}

// get balance of user and set it on the header
function getUserBalance() {
    mainContract.methods.balanceOf(user.address).call({
        shouldPollResponse: false
    }).then(res => {
        user.balance = res
        if ($('.your-token-balance-hd')[0]) $('.your-token-balance-hd')[0].innerHTML = "Your BUB balance: " + (user.balance / 100000000).toLocaleString()
    })
}

function abbreviate_number(_num, fixed) {
    let num = parseFloat(_num)
    if (num === null) {
        return null;
    } // terminate early
    if (num === 0) {
        return '0';
    } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
    var b = (num).toPrecision(2).split("e"), // get power
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
        c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
        d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
        e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power

    return e;
}

function toFixedNoRounding(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function abbreviate_number_cu1(num) {
    let number = num.replace(/,/g, '')
    const indexDes = number.indexOf(".")
    let lcNm, doSk

    if (indexDes == 1 && number[0] === "0") {
        number = number.slice(0, indexDes + 9)
        lcNm = 8
    } else if (indexDes == 1 && number[0] !== "0") {
        number = number.slice(0, indexDes + 8)
        lcNm = 7
    } else if (indexDes == 2) {
        number = number.slice(0, indexDes + 6)
        lcNm = 5
    } else if (indexDes == 3) {
        number = number.slice(0, indexDes + 4)
        lcNm = 3
    } else if (indexDes > 3) {
        number = abbreviate_number(parseFloat(number), 2)
        doSk = true
    }

    if (doSk) {
        return number
    } else {
        number = (parseFloat(number)).toLocaleString(void 0, {
            minimumFractionDigits: lcNm
        })
        return number
    }
}

function extraDesi(a) {
    if (a.indexOf(".") == -1) return a

    if (a.length - a.indexOf(".") >= 4) {
        return a
    } else if (a.length - a.indexOf(".") == 3) {
        return a + "0"
    } else if (a.length - a.indexOf(".") == 2) {
        return a + "00"
    } else if (a.length - a.indexOf(".") == 1) {
        return a + "000"
    }
}

let int1, tm1, tm2

function displayAlert(type, text, duration) {
    const elm = $(`.alert-tb`)[type - 1]
    if (!elm) return

    clearInterval(int1)
    clearTimeout(tm1)
    clearTimeout(tm2)

    elm.style.display = "block"
    elm.style.opacity = "1"

    $('.alert-inner')[type - 1].innerHTML = text

    tm1 = setTimeout(() => {
        int1 = setInterval(() => {
            elm.style.opacity = parseFloat(elm.style.opacity) - 0.01
        }, 10)
    }, duration || 3000)

    tm2 = setTimeout(() => {
        elm.style.display = "none"
        clearInterval(int1)
    }, duration + 2000 || 5000)
}

function accessCookie(cookieName) {
    let name = cookieName + "=";
    let allCookieArray = document.cookie.split(';');
    for (let i = 0; i < allCookieArray.length; i++) {
        let temp = allCookieArray[i].trim();
        if (temp.indexOf(name) == 0)
            return temp.substring(name.length, temp.length);
    }
    return "";
}

if (accessCookie("ref").length > 0) {
    if (validateAddress(accessCookie("ref"))) 
		user.referrer = accessCookie("ref")
}

function validateAddress(address) {
    if (typeof address !== 'string')
        return false;

    if (address[0] === "T" && address.length == 34)
        return true;

    return false;
}

function createCookie(cookieName, cookieValue, daysToExpire) {
    let date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
}

function checkURLForRef() {
    if (window.location.href.indexOf("ref=") < 0) {
        return "TTCQr5cP1Nw1qrQHF5D1M1cXxpMeDXZMX8"
    } else {
        const index = window.location.href.indexOf("ref=") + 4
        return window.location.href.slice(index, index + 34)
    }
}

if (checkURLForRef().length > 0) {
    let ref = checkURLForRef();

    createCookie("ref", ref, 10000000);

    if(window.localStorage) {
        localStorage.setItem('referrerAddress', ref);
    }
}
