define(["jQuery","emby-checkbox","listViewStyle","emby-input","emby-select"],function($){"use strict";return function(page,providerId,options){function reload(){Dashboard.showLoadingMsg(),ApiClient.getNamedConfiguration("livetv").then(function(config){var info=config.ListingProviders.filter(function(i){return i.Id==providerId})[0]||{};listingsId=info.ListingsId,$("#selectListing",page).val(info.ListingsId||""),page.querySelector(".txtUser").value=info.Username||"",page.querySelector(".txtPass").value="",page.querySelector(".txtZipCode").value=info.ZipCode||"",info.Username&&info.Password?page.querySelector(".listingsSection").classList.remove("hide"):page.querySelector(".listingsSection").classList.add("hide"),page.querySelector(".chkAllTuners").checked=info.EnableAllTuners,page.querySelector(".chkAllTuners").checked?page.querySelector(".selectTunersSection").classList.add("hide"):page.querySelector(".selectTunersSection").classList.remove("hide"),setCountry(info),refreshTunerDevices(page,info,config.TunerHosts)})}function setCountry(info){ApiClient.getJSON(ApiClient.getUrl("LiveTv/ListingProviders/SchedulesDirect/Countries")).then(function(result){var i,length,countryList=[];for(var region in result){var countries=result[region];if(countries.length&&"ZZZ"!==region)for(i=0,length=countries.length;i<length;i++)countryList.push({name:countries[i].fullName,value:countries[i].shortName})}countryList.sort(function(a,b){return a.name>b.name?1:a.name<b.name?-1:0}),$("#selectCountry",page).html(countryList.map(function(c){return'<option value="'+c.value+'">'+c.name+"</option>"}).join("")).val(info.Country||""),$(page.querySelector(".txtZipCode")).trigger("change")},function(){Dashboard.alert({message:Globalize.translate("ErrorGettingTvLineups")})}),Dashboard.hideLoadingMsg()}function submitLoginForm(){Dashboard.showLoadingMsg(),require(["cryptojs-sha1"],function(){var info={Type:"SchedulesDirect",Username:page.querySelector(".txtUser").value,EnableAllTuners:!0,Password:CryptoJS.SHA1(page.querySelector(".txtPass").value).toString()},id=providerId;id&&(info.Id=id),ApiClient.ajax({type:"POST",url:ApiClient.getUrl("LiveTv/ListingProviders",{ValidateLogin:!0}),data:JSON.stringify(info),contentType:"application/json",dataType:"json"}).then(function(result){Dashboard.processServerConfigurationUpdateResult(),providerId=result.Id,reload()},function(){Dashboard.alert({message:Globalize.translate("ErrorSavingTvProvider")})})})}function submitListingsForm(){var selectedListingsId=$("#selectListing",page).val();if(!selectedListingsId)return void Dashboard.alert({message:Globalize.translate("ErrorPleaseSelectLineup")});Dashboard.showLoadingMsg();var id=providerId;ApiClient.getNamedConfiguration("livetv").then(function(config){var info=config.ListingProviders.filter(function(i){return i.Id==id})[0];info.ZipCode=page.querySelector(".txtZipCode").value,info.Country=$("#selectCountry",page).val(),info.ListingsId=selectedListingsId,info.EnableAllTuners=page.querySelector(".chkAllTuners").checked,info.EnabledTuners=info.EnableAllTuners?[]:$(".chkTuner",page).get().filter(function(i){return i.checked}).map(function(i){return i.getAttribute("data-id")}),ApiClient.ajax({type:"POST",url:ApiClient.getUrl("LiveTv/ListingProviders",{ValidateListings:!0}),data:JSON.stringify(info),contentType:"application/json"}).then(function(result){Dashboard.hideLoadingMsg(),options.showConfirmation!==!1&&Dashboard.processServerConfigurationUpdateResult(),Events.trigger(self,"submitted")},function(){Dashboard.hideLoadingMsg(),Dashboard.alert({message:Globalize.translate("ErrorAddingListingsToSchedulesDirect")})})})}function refreshListings(value){return value?(Dashboard.showLoadingMsg(),void ApiClient.ajax({type:"GET",url:ApiClient.getUrl("LiveTv/ListingProviders/Lineups",{Id:providerId,Location:value,Country:$("#selectCountry",page).val()}),dataType:"json"}).then(function(result){$("#selectListing",page).html(result.map(function(o){return'<option value="'+o.Id+'">'+o.Name+"</option>"})),listingsId&&$("#selectListing",page).val(listingsId),Dashboard.hideLoadingMsg()},function(result){Dashboard.alert({message:Globalize.translate("ErrorGettingTvLineups")}),refreshListings(""),Dashboard.hideLoadingMsg()})):void $("#selectListing",page).html("")}function getTunerName(providerId){switch(providerId=providerId.toLowerCase()){case"m3u":return"M3U Playlist";case"hdhomerun":return"HDHomerun";case"satip":return"DVB";default:return"Unknown"}}function refreshTunerDevices(page,providerInfo,devices){for(var html="",i=0,length=devices.length;i<length;i++){var device=devices[i];html+='<div class="listItem">';var enabledTuners=providerInfo.EnabledTuners||[],isChecked=providerInfo.EnableAllTuners||enabledTuners.indexOf(device.Id)!=-1,checkedAttribute=isChecked?" checked":"";html+='<label class="checkboxContainer listItemCheckboxContainer"><input type="checkbox" is="emby-checkbox" data-id="'+device.Id+'" class="chkTuner" '+checkedAttribute+"/><span></span></label>",html+='<div class="listItemBody two-line">',html+='<div class="listItemBodyText">',html+=device.FriendlyName||getTunerName(device.Type),html+="</div>",html+='<div class="listItemBodyText secondary">',html+=device.Url,html+="</div>",html+="</div>",html+="</div>"}page.querySelector(".tunerList").innerHTML=html}var listingsId,self=this;self.submit=function(){page.querySelector(".btnSubmitListingsContainer").click()},self.init=function(){options=options||{},options.showCancelButton!==!1?page.querySelector(".btnCancel").classList.remove("hide"):page.querySelector(".btnCancel").classList.add("hide"),options.showSubmitButton!==!1?page.querySelector(".btnSubmitListings").classList.remove("hide"):page.querySelector(".btnSubmitListings").classList.add("hide"),$(".formLogin",page).on("submit",function(){return submitLoginForm(),!1}),$(".formListings",page).on("submit",function(){return submitListingsForm(),!1}),$(".txtZipCode",page).on("change",function(){refreshListings(this.value)}),page.querySelector(".chkAllTuners").addEventListener("change",function(e){e.target.checked?page.querySelector(".selectTunersSection").classList.add("hide"):page.querySelector(".selectTunersSection").classList.remove("hide")}),$(".createAccountHelp",page).html(Globalize.translate("MessageCreateAccountAt",'<a href="http://www.schedulesdirect.org" target="_blank">http://www.schedulesdirect.org</a>')),reload()}}});