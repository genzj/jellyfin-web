define(["fetchHelper","jQuery","registrationServices"],function(fetchHelper,$,registrationServices){"use strict";function load(page){Dashboard.showLoadingMsg(),ApiClient.getPluginSecurityInfo().then(function(info){$("#txtSupporterKey",page).val(info.SupporterKey),info.SupporterKey&&!info.IsMBSupporter?(page.querySelector("#txtSupporterKey").classList.add("invalidEntry"),$(".notSupporter",page).show()):(page.querySelector("#txtSupporterKey").classList.remove("invalidEntry"),$(".notSupporter",page).hide()),Dashboard.hideLoadingMsg()})}function loadUserInfo(page){Dashboard.getPluginSecurityInfo().then(function(info){info.IsMBSupporter?$(".supporterContainer",page).addClass("hide"):$(".supporterContainer",page).removeClass("hide")})}function retrieveSupporterKey(){Dashboard.showLoadingMsg();var form=this,email=$("#txtEmail",form).val(),url="https://mb3admin.com/admin/service/supporter/retrievekey?email="+email;return console.log(url),fetchHelper.ajax({url:url,type:"POST",dataType:"json"}).then(function(result){Dashboard.hideLoadingMsg(),result.Success?require(["toast"],function(toast){toast(Globalize.translate("MessageKeyEmailedTo").replace("{0}",email))}):require(["toast"],function(toast){toast(result.ErrorMessage)}),console.log(result)}),!1}function onSupporterLinkClick(e){registrationServices.showPremiereInfo(),e.preventDefault(),e.stopPropagation()}var SupporterKeyPage={updateSupporterKey:function(){Dashboard.showLoadingMsg();var form=this,key=$("#txtSupporterKey",form).val(),info={SupporterKey:key};return ApiClient.updatePluginSecurityInfo(info).then(function(){Dashboard.resetPluginSecurityInfo(),Dashboard.hideLoadingMsg(),key?Dashboard.alert({message:Globalize.translate("MessageKeyUpdated"),title:Globalize.translate("HeaderConfirmation")}):Dashboard.alert({message:Globalize.translate("MessageKeyRemoved"),title:Globalize.translate("HeaderConfirmation")});var page=$(form).parents(".page")[0];load(page)}),!1},linkSupporterKeys:function(){Dashboard.showLoadingMsg();var form=this,email=$("#txtNewEmail",form).val(),newkey=$("#txtNewKey",form).val(),oldkey=$("#txtOldKey",form).val(),url="https://mb3admin.com/admin/service/supporter/linkKeys";return console.log(url),fetchHelper.ajax({url:url,type:"POST",dataType:"json",query:{email:email,newkey:newkey,oldkey:oldkey}}).then(function(result){Dashboard.hideLoadingMsg(),result.Success?require(["toast"],function(toast){toast(Globalize.translate("MessageKeysLinked"))}):require(["toast"],function(toast){toast(result.ErrorMessage)}),console.log(result)}),!1}};$(document).on("pageinit","#supporterKeyPage",function(){var page=this;$("#supporterKeyForm",this).on("submit",SupporterKeyPage.updateSupporterKey),$("#lostKeyForm",this).on("submit",retrieveSupporterKey),$("#linkKeysForm",this).on("submit",SupporterKeyPage.linkSupporterKeys),page.querySelector(".benefits").innerHTML=Globalize.translate("HeaderSupporterBenefit",'<a class="lnkPremiere" href="http://emby.media/premiere" target="_blank">',"</a>"),page.querySelector(".lnkPremiere").addEventListener("click",onSupporterLinkClick)}).on("pageshow","#supporterKeyPage",function(){var page=this;loadUserInfo(page),load(page)})});