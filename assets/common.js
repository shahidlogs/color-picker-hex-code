(function(){
  'use strict';
  window.ColorTools={
    channelToHex:function(value){return value.toString(16).toUpperCase().padStart(2,'0');},
    rgbToHex:function(r,g,b){return '#'+this.channelToHex(r)+this.channelToHex(g)+this.channelToHex(b);},
    normalizeHex:function(value){
      var clean=String(value).trim().replace(/^#/,'');
      if(!/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean))return null;
      if(clean.length===3)clean=clean.split('').map(function(c){return c+c;}).join('');
      return '#'+clean.toUpperCase();
    },
    hexToRgb:function(value){var hex=this.normalizeHex(value);if(!hex)return null;var n=parseInt(hex.slice(1),16);return{r:(n>>16)&255,g:(n>>8)&255,b:n&255,hex:hex};},
    hslToRgb:function(h,s,l){
      h=((h%360)+360)%360;s/=100;l/=100;var c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2,r=0,g=0,b=0;
      if(h<60){r=c;g=x}else if(h<120){r=x;g=c}else if(h<180){g=c;b=x}else if(h<240){g=x;b=c}else if(h<300){r=x;b=c}else{r=c;b=x}
      return{r:Math.round((r+m)*255),g:Math.round((g+m)*255),b:Math.round((b+m)*255)};
    },
    copy:function(text,status){
      function done(){status.textContent='Copied '+text;setTimeout(function(){status.textContent='';},2200)}
      if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(done).catch(function(){fallback();});}else fallback();
      function fallback(){var area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();try{document.execCommand('copy');done();}catch(e){status.textContent='Select the value and copy it manually.';}area.remove();}
    }
  };
}());
