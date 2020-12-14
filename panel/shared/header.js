$('.shared-header')[0].innerHTML =
`
<div class="mobile-menu md:hidden" style="border: 0;">
    <div class="mobile-menu-bar" style="height: 60px;">
        <a class="flex mr-auto" onclick="openMenuM()">
            <img alt="BUB Token" class="w-6" src="../img/BUB-logo-lg.jpg" style="width: 27vw;filter: drop-shadow(0px 0px 3px #2095ff);">
        </a>

        <div class="top-bar-boxed flex items-center">
            <div style="*/height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #4490c7;font-size: 18px;font-weight: 500;margin-right: 28px;"><span class="day-end-in" id="countdownm" style="padding-right: 10px;">Auction ends at 00:00 UTC</span></div>

            <div style="height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #4490c7;font-size: 18px;font-weight: 500;margin-right: 10px;"><span class="my-acc-add"></span><img class="img-mm" src="../img/tronlink.jpg" style="width: 12px;margin-top: -3.7px;margin: 0px 1px 0px 1px;float: right;border-radius: 4px;"></div>
        </div>

        <a onclick="openMenuM()"> <i data-feather="bar-chart-2"
                class="w-8 h-8 text-white transform -rotate-90" style="color: 051242"></i> </a>
    </div>

    <div class="mobile-exten" style="background: #3b5166;height: 60px;z-index: 1000000000;position: absolute;width: 100%;display: flex;align-items: center;display: none; height: auto;">

        <ul class="border-t border-theme-24 py-7">
             <li>
                <a href="stake.html" class="menu">
                    <div class="menu__icon"> <i data-feather="layers"></i> </div>
                    <div class="menu__title"> Stake </div>
                </a>
            </li>
            <li>
                <a href="auction.html" class="menu">
                    <div class="menu__icon"> <i data-feather="server"></i> </div>
                    <div class="menu__title"> Auction </div>
                </a>
            </li>
            <li>
				<span class="telemenu">
                <a href="" class="menu ">
                    <div class="menu__icon"> <i data-feather="users"></i> </div>
                    <div class="menu__title"> Telegram </div>
                </a>
				</span>
            </li>    
            <li>
				<span class="trcmenu">
					<a href="trcwebsite" class="menu ">
                    <div class="menu__icon"> <i data-feather="server"></i> </div>
                    <div class="menu__title"> NAME </div>
					</a>
				</span>
            </li> 
            <li>
                <a href="refer.html" class="menu ">
                    <div class="menu__icon"> <i data-feather="users"></i> </div>
                    <div class="menu__title"> Refer & FAQ </div>
                </a>
            </li>   			
        </ul>
    </div>


</div>
<div class="border-b hd-nm border-theme-24 -mt-10 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 pt-3 md:pt-0 mb-10" style="border-bottom: 1px solid #040417;">
    <div class="top-bar-boxed flex items-center">
        <!-- BEGIN: Logo -->
        <div class="-intro-x hidden md:flex">
            <img src="../img/BUB-logo-lg.jpg" style="width: 3.5rem;">
            <span class="text-white text-lg ml-3" style="padding-top: 0.2rem;font-size: 28px;padding-left: 5px;font-weight: 500;color: #ecf590;"></span>
        </div>
        <!-- END: Logo -->
        <!-- BEGIN: Breadcrumb -->
        <div class="-intro-x breadcrumb breadcrumb--light mr-auto" style=""> 
        <span style="font-size: 20px;color: #4490c7;font-weight: 400;">TRX Auction for BUB Token staking!</span></div>
        <!-- END: Breadcrumb -->

        <div style="*/height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #4490c7;font-size: 18px;font-weight: 500;margin-right: 20px;"><span class="telegram" style="padding-right: 10px;"><a href="https://t.me" target="_blank">Telegram</a></span></div>

        <div style="*/height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #4490c7;font-size: 18px;font-weight: 500;margin-right: 20px;"><span class="Tronscan" style="padding-right: 10px;"><a href="https://Tronscan.io/" target="_blank">Tronscan</a></span></div>

        <div style="*/height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #4490c7;font-size: 18px;font-weight: 500;margin-right: 20px;"><span class="day-end-in" id="countdown" style="padding-right: 10px;">Auction ends at: 00:00:00</span></div>

        <div style="height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #4490c7;font-size: 18px;font-weight: 500;"><span class="my-acc-add">...</span><img class="img-metamask" src="../img/tronlink.jpg" style="width: 28px;margin-top: -3.7px;margin: 0px 1px 0px 1px;float: right;border-radius: 6px;"></div>
    </div>
</div>
`

let mmO
setInterval(() => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('.hd-nm')[0].style.display = "none"
        $('.my-acc-add')[0].style.fontSize = "8px"
        $('.day-end-in')[0].style.fontSize = "8px"
	}
}, 1000)

function openMenuM() {
    if (mmO) {
        mmO = false
        $('.mobile-exten')[0].style.display = "none"
    } else {
        mmO = true
        $('.mobile-exten')[0].style.display = "block"
    }
}

    function zeroPrefix(val) {
        if ((val.toString()).length < 2) {
            val = '0' + val;
        }

        return val;
    }	

    setInterval(function time() {
        let d = new Date(),
            hours = 23 - d.getUTCHours(),
            min = 59 - d.getUTCMinutes(),
            sec = 59 - d.getUTCSeconds();
		if(currentDay < 1){
			document.getElementById('countdown').innerHTML = 'Auction Starts: ' + zeroPrefix(hours) + ' : ' + zeroPrefix(min) + ' : ' + zeroPrefix(sec);
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				document.getElementById('countdownm').innerHTML = 'Auction Starts: ' + zeroPrefix(hours) + ' : ' + zeroPrefix(min) + ' : ' + zeroPrefix(sec);
			}
		}else{
			document.getElementById('countdown').innerHTML = 'Auction End: ' + zeroPrefix(hours) + ' : ' + zeroPrefix(min) + ' : ' + zeroPrefix(sec);
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				document.getElementById('countdownm').innerHTML = 'Auction End: ' + zeroPrefix(hours) + ' : ' + zeroPrefix(min) + ' : ' + zeroPrefix(sec);
			}
		}
		
    }, 1000);
