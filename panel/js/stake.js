
let stakeData = {
    entered_amount: 0,
    entered_days: 0,
    currentDay: void 0,
    stakingShare: void 0,
    clc_1: 0,
    clc_2: 0,
    shareRate: 0
}

const LPB = 1820
const LPB_MAX_DAYS = 3640

const BPB_MAX_HEARTS = ((7 * 1000000) * (100000000))
const BPB = BPB_MAX_HEARTS * 100 / 10

let holder, clcD1 = true,
    clcD2 = true


function refreshMyStakes() {
	getMyStakes()
}

function refreshMyEndedStakes() {
    //getMyEndedStakes()
}

function run_Stake() {
    mainContract.methods.globalInfo().call({
        shouldPollResponse: true
    }).then(res => {
        stakeData.stakingShare = res[2]
        $('.st-val-1')[0].innerHTML = currentDay + 1

        stakeData.shareRate = (100000 / stakeData.stakingShare) * 100000000
    })

    mainContract.methods.xfLobby(currentDay).call({
        shouldPollResponse: true
    }).then(res => {
        $('.st-val-8')[0].innerHTML = abbreviate_number(res / 1e6, 2) + " TRX"
    })

    getDaysData()
    //getMyEndedStakes()
    estimateNextDay()
}

const DaysData = []
var dayIndex = 1
var arrIndex = 0

function getDaysData() {
	
	while(dayIndex < currentDay){
		loadDaysData(dayIndex, arrIndex)
		dayIndex++
		arrIndex++
	}
	if(DaysData[currentDay-1] != "undefined")
		getMyStakes()
	else
		getDaysData()

}

async function loadDaysData(di, ai){
	
	try{
		mainContract.methods.dailyData(di).call({}, function(error, res){
			if(error){
				loadDaysData(di, ai)
				return
			}else{
				res.day = di
				DaysData[ai] = res
			}
		})
	}catch(e){
		console.log(error)
	}
		
}

setInterval(() => {
    run_Stake(true)
}, 1000 * 100)

setInterval(() => {
    if($('.active-stake-loading')[0] != undefined)
		if($('.active-stake-loading')[0].innerHTML == "Loading...")
			getDaysData()
}, 1000)

function stakeChangeDays() {
    stakeData.entered_days = parseInt($('.stake-inp-day')[0].value)

    const stakeDays = stakeData.entered_days + currentDay
    $('.st-val-2')[0].innerHTML = stakeDays + 1
    $('.st-val-2')[0].style.color = "#2eff3c"

    let extraDays = stakeData.entered_days - 1
    if (extraDays > LPB_MAX_DAYS) extraDays = LPB_MAX_DAYS
    stakeData.clc_1 = (extraDays / 1820)

    holder = abbreviate_number_cu1((stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value)).toLocaleString(void 0, {
        minimumFractionDigits: 8
    }))
    $('.st-val-5')[0].innerHTML = "+ " + holder + " BUB"

    calculator()
}

function stakeChangeAmount() {
    stakeData.entered_amount = parseFloat($('.stake-inp-amount')[0].value)

    stakeData.clc_2 = stakeData.entered_amount * (Math.min(stakeData.entered_amount, 150000000) / 1500000000)

    holder = abbreviate_number_cu1((stakeData.clc_2).toLocaleString(void 0, {
        minimumFractionDigits: 8
    }))
    $('.st-val-4')[0].innerHTML = "+ " + holder + " BUB"

    holder = abbreviate_number_cu1((stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value)).toLocaleString(void 0, {
        minimumFractionDigits: 8
    }))
    $('.st-val-5')[0].innerHTML = "+ " + holder + " BUB"

    calculator()
}


function calculator() {
    if (!currentDay) return

    holder = abbreviate_number(stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value) + stakeData.clc_2, 2)
    $('.st-val-6')[0].innerHTML = holder + " BUB"

    let effective = parseFloat($('.stake-inp-amount')[0].value) + (stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value) + stakeData.clc_2)
    holder = abbreviate_number(effective, 2)
    $('.st-val-7')[0].innerHTML = holder + " BUB"
}

setInterval(() => {
	if(parseInt($('.stake-inp-day')[0].value) > 365){
		$('.stake-inp-day')[0].value = 365
		alert("Max Stake Days: 365")
		return
	}
}, 250)

function doStake() {
    $('.btn-usertransfer-load')[0].style.display = "block"
    $('.btn-usertransfer-txt')[0].innerHTML = ""

    mainContract.methods.balanceOf(user.address).call({
        shouldPollResponse: true
    }).then(res => {
        if (res < parseFloat($('.stake-inp-amount')[0].value)) {
            displayAlert(3, "Not Enough Balance !")
            $('.btn-usertransfer-load')[0].style.display = "none"
            $('.btn-usertransfer-txt')[0].innerHTML = "STAKE"
        } else {
            mainContract.methods.stakeStart(parseFloat($('.stake-inp-amount')[0].value) * DESI, parseInt($('.stake-inp-day')[0].value)).send({
                from: user.address,
                shouldPollResponse: false
            }).then(res => {
                displayAlert(1, `Successfully staked ${parseFloat($('.stake-inp-amount')[0].value)} BUB for ${parseInt($('.stake-inp-day')[0].value)} days.`)
                refreshMyStakes()
            }).catch(err => {
                displayAlert(3, "Something went wrong!")
                console.log(err)
            }).finally(res => {
                $('.btn-usertransfer-load')[0].style.display = "none"
                $('.btn-usertransfer-txt')[0].innerHTML = "STAKE"
            })
        }
    })
}


async function getMyStakes() {
    mainContract.methods.stakeCount(user.address).call({}, function(error, res){
		if(!error){

			const myStakesCount = res
			if( myStakesCount == 0 )
				$('.active-stake-loading')[0].innerHTML = "No active stakes! :( Join the auction to get BUB!"
				
			let toBeRendered = []

			let strt = 0
			ck1()

			function ck1() {
				if (strt < myStakesCount) {
					getDrc()
				}
			}

			function getDrc() {
				mainContract.methods.stakeLists(user.address, strt).call({}, function(error, res2){
					if(!error){
						strt++
						toBeRendered.push(res2)
						if (toBeRendered.length == myStakesCount) {
							toBeRendered.sort((b, a) => parseInt(a.stakeId) - parseInt(b.stakeId))
							if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
								renderMyStakesMobile(toBeRendered)
							else
								renderMyStakes(toBeRendered)
						}else {
							ck1()
						}
					}
				})
			}
			
		}else
			getMyStakes()
    })
}

function renderMyStakes(data) {
    let rows = []

    let ii = 0
    data.forEach(item => {
        ii++

        item.lockedDay = parseInt(item.lockedDay)
        item.stakedDays = parseInt(item.stakedDays)

        let progress, btnTheme = "bg-theme-101",
            btnTxt = "CANCEL"
        if (item.lockedDay == currentDay + 1) {
            progress = `
            <div class="w-64 sm:w-auto truncate"
                style="width: 150vw; text-align:center; font-weight: 900;">
                <span class="inbox__item--highlight">Locked Day</span>
            </div>
            `
        } else if (item.lockedDay == currentDay) {
            progress = `
            <div class="w-64 sm:w-auto truncate"
                style="width: 150vw; text-align:center; font-weight: 900;">
                <div class="progress-b" style=""><div class="progress-bn" style="width: 2%;"></div></div>
            </div>
            `
        } else if (item.lockedDay + item.stakedDays < currentDay + 1) {
            progress = `
            <div class="w-64 sm:w-auto truncate"
                style="width: 150vw; text-align:center; font-weight: 900;">
                <div class="progress-b" style=""><div class="progress-bn" style="width: 100%;"></div></div>
            </div>
            `
            btnTxt = "COLLECT"
            btnTheme = "bg-theme-100"
        } else if (item.lockedDay < currentDay + 1 && (item.lockedDay + item.stakedDays >= currentDay + 1)) {
            let clcR1 = currentDay - item.lockedDay
            let clcR2 = (clcR1 / item.stakedDays) * 100
            progress = `
            <div class="w-64 sm:w-auto truncate"
                style="width: 150vw; text-align:center; font-weight: 900;">
                <div class="progress-b" style=""><div class="progress-bn" style="width: ${clcR2}%;"></div></div>
            </div>
            `
        }


        let activeRow = "item-sln"
        if (!clcD1) activeRow = "item-slm"

        let stakedSuns = item.stakedSuns
        let stakeShares =item.stakeShares

        let stakeButton = `
        <div class="w-64 sm:w-auto truncate"
            style="width: 100vw; text-align:center; font-weight: 900;">
            <button class="button w-24 mr-1 mb-2 ${btnTheme} text-white" onClick="endStake(${item.stakeId})"
                style="width: auto; padding: 0px 5px;margin: 0; opacity: 0.5;">
            ${btnTxt}</button>
        </div>
        `

        const newItem =
            `
        <div class="intro-y">
            <div class="${activeRow} row-body inbox__item inline-block sm:block text-gray-700 bg-gray-100 border-b border-gray-200"
                style="cursor: auto; color: #2eff3c; ">
                <div class="flex px-5 py-3"
                    style="padding-left: .0rem; padding-right: .0rem; color: #2eff3c;">
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 50vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span class="inbox__item--highlight">${item.lockedDay}</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 50vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span class="inbox__item--highlight">${item.lockedDay + item.stakedDays}</span>
                    </div>
    
                    ${progress}
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 90vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span class="inbox__item--highlight">${abbreviate_number(parseInt(stakedSuns) / DESI, 2)}</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 110vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span class="inbox__item--highlight">${abbreviate_number(parseInt(stakeShares) / DESI, 2)}</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 125vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span class="daily-bonus-it-${ii} inbox__item--highlight" id="0">--</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 125vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span class="dividends-it-${ii} inbox__item--highlight" id="0">--</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 100vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span class="interest-tn-${ii} inbox__item--highlight">--</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 100vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span class="interest-tm-${ii} inbox__item--highlight" id="${parseInt(stakedSuns) / DESI}">--</span>
                    </div>
    
                    ${stakeButton}
                </div>
            </div>
        </div>
        `

        calcInterest(`interest-tn-${ii}`, `interest-tm-${ii}`, `daily-bonus-it-${ii}`, parseInt(item.stakeShares) / DESI, item.lockedDay, item.stakedDays + item.lockedDay)

        calcDividends(`dividends-it-${ii}`, item.lockedDay, item.stakedDays, stakeShares)

        getDailyBonusRewards(parseInt(item.lockedDay), parseInt(item.stakedDays), stakeShares, `daily-bonus-it-${ii}`)

        clcD1 = !clcD1
        rows.push(newItem)
    })

    $('.my-stakes-list')[0].innerHTML = ""

    for (var i = 0; i < rows.length; i++) {
        $('.my-stakes-list')[0].innerHTML += rows[i]
    }
}
/*START STAKE CALCULATIONS 
  dayPayoutTotal   uint72 :
  dayDividends   uint256 : 1e18
  dayStakeSharesTotal   uint72 :
*/
function calcDividends(elm, lockedDay, stakedDays, stakeShares) {
    setTimeout(() => {
        let addUpDivs = 0

        for (var i = 0; i < stakedDays; i++) {
            DaysData.forEach(item => {
                if (item.day == lockedDay + i) {
					let divs = item.dayDividends
					let userShares = item.dayStakeSharesTotal
					let shares = stakeShares
					if(Number.isNaN(divs) || Number.isNaN(shares) || Number.isNaN(userShares) || shares == 0 || userShares == 0){
						divs = 0
						shares = 1
						userShares = 1
					}
                    addUpDivs += ( (divs / 1e6) * 0.97 ) * shares / userShares
                    $(`.${elm}`)[0].innerHTML = abbreviate_number((addUpDivs), 1) + " TRX"
                }
            })

        }
    }, 3000)
}
function getDailyBonusRewards(startDay, stakedDays, stakeShares, item) {
    setTimeout(() => {
        let counter = 0
        for (var ii = startDay; ii < stakedDays + startDay; ii++) {
            if (counter < 4) {
                counter++;
            } else {
                processDailyBonus(ii, item)
                counter = 0;
            }
        }

        function processDailyBonus(theDay, _elm) {
			let dpt = 0
			let shares = 0
			let dayShares = 0
            DaysData.forEach(item => {
                if (item.day == theDay) {
                    let elm = document.getElementsByClassName(`${_elm}`)[0]
                    if (!item.dayPayoutTotal) {
                        if (elm.innerHTML === "..." || elm.innerHTML === "0") elm.innerHTML = "0"
                        return
                    }
					dpt = parseFloat(item.dayPayoutTotal)
					shares = parseFloat(stakeShares)
					dayShares = parseFloat(item.dayStakeSharesTotal)
					if(Number.isNaN(dpt) || Number.isNaN(shares) || Number.isNaN(dayShares) || shares == 0 || dayShares == 0){
						dpt = 0
						shares = 1
						dayShares = 1
					}
                    let calc = ((( dpt / 1e8 * shares ) / dayShares ) * 1)
                    if (elm && elm.id) {
                        elm.innerHTML = abbreviate_number(parseFloat(elm.id) + parseFloat(calc), 1)
                        elm.id = calc
                    }
                }
            })
        }
    }, 3000)
}
function calcInterest(item, item2, item3, stakeShares, startDay, endDay) {
    setTimeout(() => {
        let interest = 0
		
		let dpt = 0
		let shares = 0
		let dayShares = 0

        for (var i = startDay; i < endDay; i++) {
            DaysData.forEach(item => {
                if (item.day == i) {
					dpt = parseFloat(item.dayPayoutTotal)
					shares = parseFloat(stakeShares)
					dayShares = parseFloat(item.dayStakeSharesTotal)
					if(Number.isNaN(dpt) || Number.isNaN(shares) || Number.isNaN(dayShares) || shares == 0 || dayShares == 0){
						dpt = 0
						shares = 1
						dayShares = 1
					}
                    interest += dpt * shares / dayShares
                }
            })
        }
        $(`.${item}`)[0].innerHTML = `${abbreviate_number(interest, 1)}`
        
        if ($(`.${item2}`)[0].id && $(`.${item3}`)[0].id) $(`.${item2}`)[0].innerHTML = `${abbreviate_number(parseFloat($(`.${item2}`)[0].id) + parseFloat($(`.${item3}`)[0].id) + interest, 1)}`
    }, 3000)
}
//END STAKE CALCULATIONS
function addUpCurrentValue() {
    $('.interest-tm-${ii}')
}

function endStake(stakeId) {
    getStakesCount()

    function getStakesCount() {
        mainContract.methods.stakeCount(user.address).call({
            shouldPollResponse: true
        }).then(res => {
            for (var i = 0; i < res; i++) {
                checkListForIndex(i)
            }
        })
    }

    function checkListForIndex(i) {
        mainContract.methods.stakeLists(user.address, i).call({
            shouldPollResponse: true
        }).then(res => {
            if (res.stakeId == stakeId) doEnd(i)
        })
    }

    function doEnd(stakeIndex) {
        mainContract.methods.stakeEnd(stakeIndex, stakeId).send({
            from: user.address,
            shouldPollResponse: true,
        }).then(res => {
            refreshMyStakes()
            setTimeout(() => {
				refreshMyEndedStakes()
            }, 1500)
        })
    }
}

function getMyEndedStakes() {
	var i = 0
	
	mainContract.getPastEvents('StakeEnd', {
		filter: {stakerAddr: user.address},
		fromBlock: 0,
		toBlock: 'latest'
	}).then(events =>{
		while(i < events.length){
			
			renderMyEndedStakes
			(
				events[i].returnValues.lockedDay,
				events[i].returnValues.servedDays,
				events[i].returnValues.stakedSuns,
				events[i].returnValues.dividends,
				events[i].returnValues.payout,
				events[i].returnValues.stakeReturn
			)
			i++
		}
		if(i == 0){
			$('.ended-stake-loading')[0].innerHTML = "No ended stakes! Stake your BUB!"
		}
	})
	i = 0
}

function renderMyEndedStakes(lockedDay, servedDays, stakedSuns, dividends, payout, stakeReturn) {
		$('.my-ended-stakes-list')[0].innerHTML = ""

        let endDay = lockedDay + servedDays

        let progress = "Canceled"
        if (endDay < currentDay)
			if(stakeReturn < payout + stakedSuns)
				progress = "Partial"
			else
				progress = "Finished"

        let activeRow = "item-sln"
        if (!clcD2) 
			activeRow = "item-slm"

        let row =
	`
       <div class="intro-y">
            <div class="${activeRow} row-body inbox__item inline-block sm:block text-gray-700 bg-gray-100 border-b border-gray-200"
                style="cursor: auto; color: #051242;">
                <div class="flex px-5 py-3" 
					style="padding-left: .0rem; padding-right: .0rem; color: #051242;">

                    <div class="w-64 sm:w-auto truncate ended-stake-info-1"
                        style="width: 50vw; text-align:center; font-weight: 900; color: #051242;">
                        <span class="inbox__item--highlight">${lockedDay}</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate ended-stake-info-2"
                        style="width: 50vw; text-align:center; font-weight: 900; color: #051242;">
                        <span class="inbox__item--highlight">${endDay}</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate ended-stake-info-3"
                        style="width: 70vw; text-align:center; font-weight: 900;  color: #051242;">
                        <span class="inbox__item--highlight">${progress}</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate ended-stake-info-4"
                        style="width: 125vw; text-align:center; font-weight: 900;color: #051242;">
                        <span class="inbox__item--highlight">${abbreviate_number(parseInt(stakedSuns) / DESI, 2)} BUB</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate ended-stake-info-5"
                        style="width: 125vw; text-align:center; font-weight: 900;color: #051242;">
                        <span class="inbox__item--highlight">${abbreviate_number(dividends / 10e17, 6)} TRX</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate ended-stake-info-6"
                        style="width: 125vw; text-align:center; font-weight: 900;color: #051242;>
                        <span class="inbox__item--highlight">${abbreviate_number(stakeReturn / DESI, 2)} BUB</span>
                    </div>

                </div>
            </div>
        </div>
	`
        clcD2 = !clcD2
        $('.my-ended-stakes-list')[0].innerHTML += row
}


setInterval(() => {
    eligibleBonusDays()
}, 500)

function eligibleBonusDays() {
    $('.bounty-days-el')[0].innerHTML = `Eligible for ${Math.floor(parseInt($('.stake-inp-day')[0].value || 1) / 5)} BonusDays`
}

let pstEntries = 0

function estimateNextDay() {
	pstEntries = 0
	var fourDay = currentDay - 4
	if(fourDay < 1){
		for (var i = currentDay; i > 1; i--){
			getLobbyData(i - 1)
		}
		$('.avg-day')[0].innerHTML = "Daily Average: "
	}else{
		for (var i = currentDay; i > fourDay; i--){
			getLobbyData(i - 1)
		}
	}
		
}

function getLobbyData(day) {
	mainContract.methods.xfLobby(day).call({}, function(error, res){
		if(!error){
			pstEntries += (parseInt(res) / 1e6)
			$('.st-val-9')[0].innerHTML = "~" + abbreviate_number(pstEntries / 4, 5) + " TRX"
		}else
			getLobbyData(day)
	})
}

//MOBILE STAKE ADJUSTERS
function mobileActiveStakeAdjuster(){
	for(let i = 0; i < $('.mobile-stake-hide').length; i++){
		$('.mobile-stake-hide')[i].innerHTML = ""
	}
	$('.stake-headers')[0].innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  Collect On Day &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Staked BUB &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Divs Earned"
	$('.stake-headers')[0].style.width = "84vw"
	$('.mobile-stake-resize')[0].style.width = "75vw"
	$('.mobile-stake-resize')[0].style.fontSize = "8px"
	
	//Stake Bonus Info
	$('.bonus-div-0')[0].style.width = "100vw"
	$('.bonus-div-1')[0].style.width = "100vw"
	$('.bonus-div-2')[0].style.width = "100vw"
	$('.bonus-div-3')[0].style.width = "100vw"

}

function mobileEndedStakeAdjuster(){
	for(var i = 0; i < $('.ended-stake-div').length; i++ ){
		$('.ended-stake-div')[i].style.width = "0vw"
        }
		
	$('.ended-stake-headers')[0].style.fontSize = "8px"
	$('.ended-stake-headers')[0].style.width = "93vw"
	$('.ended-stake-headers')[0].innerHTML = "Start &nbsp End &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Status &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Staked BUB &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp TRX Received &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp BUB Received &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"

	for(var i = 0; i < $('.ended-stake-info-1').length; i++){
		$('.ended-stake-info-1')[i].style.fontSize = "8px"
		$('.ended-stake-info-2')[i].style.fontSize = "8px"
		$('.ended-stake-info-3')[i].style.fontSize = "8px"
		$('.ended-stake-info-4')[i].style.fontSize = "8px"
		$('.ended-stake-info-5')[i].style.fontSize = "8px"
		$('.ended-stake-info-6')[i].style.fontSize = "8px"
		
		$('.ended-stake-info-1')[i].style.width = "6vw"
		$('.ended-stake-info-2')[i].style.width = "6vw"
		$('.ended-stake-info-3')[i].style.width = "13vw"
		$('.ended-stake-info-4')[i].style.width = "21vw"
		$('.ended-stake-info-5')[i].style.width = "21vw"
		$('.ended-stake-info-6')[i].style.width = "21vw"
	}
}
function renderMyStakesMobile(data) {

	let rows = []
    let ii = 0
    data.forEach(item => {

        ii++

        item.lockedDay = parseInt(item.lockedDay)
        item.stakedDays = parseInt(item.stakedDays)

        let progress, btnTheme = "bg-theme-101",
            btnTxt = "CANCEL"
        if (item.lockedDay == currentDay + 1) {
        } else if (item.lockedDay == currentDay) {
        } else if (item.lockedDay + item.stakedDays < currentDay + 1) {
            btnTxt = "COLLECT"
            btnTheme = "bg-theme-100"
        } else if (item.lockedDay < currentDay + 1 && (item.lockedDay + item.stakedDays >= currentDay + 1)) {
            let clcR1 = currentDay - item.lockedDay
            let clcR2 = (clcR1 / item.stakedDays) * 100
        }

        let activeRow = "item-sln"
        if (!clcD1) activeRow = "item-slm"

        let stakedSuns = item.stakedSuns
        let stakeShares =item.stakeShares

        let stakeButton = `
        <div class="w-64 sm:w-auto truncate"
            style="width: 25vw; font-weight: 900;">
            <button class="button w-24 mr-1 mb-2 ${btnTheme} text-white" onClick="endStake(${item.stakeId})"
                style="width: 20vw; padding: 0px 5px;margin: 0; opacity: 0.5;">
            ${btnTxt}</button>
        </div>
        `

        const newItem =
            `
        <div class="intro-y">
            <div class="${activeRow} row-body inbox__item inline-block sm:block text-gray-700 bg-gray-100 border-b border-gray-200"
                style="cursor: auto; color: #2eff3c; ">
                <div class="flex px-5 py-3"
                    style="padding-left: .0rem; padding-right: .0rem; color: #2eff3c;">
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 25vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span style="font-size: 8px;"class="inbox__item--highlight">${item.lockedDay + item.stakedDays+1}</span>
                    </div>
        
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 25vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span style="font-size: 8px;"class="inbox__item--highlight">${abbreviate_number(parseInt(stakedSuns) / DESI, 2)}</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 25vw; text-align:center; font-weight: 900; color: #2eff3c;">
                        <span style="font-size: 8px;"class="dividends-it-${ii} inbox__item--highlight" id="0">--</span>
                    </div>
    
                    ${stakeButton}
                </div>
            </div>
        </div>
        `

        calcDividends(`dividends-it-${ii}`, item.lockedDay, item.stakedDays, stakeShares)

        clcD1 = !clcD1
        rows.push(newItem)
    })

    $('.my-stakes-list')[0].innerHTML = ""

    for (var i = 0; i < rows.length; i++) {
        $('.my-stakes-list')[0].innerHTML += rows[i]
    }
}


function checkMobile(){
		if( parseInt( $('.mobile-stake-resize')[0].style.fontSize ) != 8 && $('.mobile-stake-resize').length > 0 ){
 			mobileActiveStakeAdjuster()
		}
}

setInterval(() => {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
		checkMobile()
}, 250)
