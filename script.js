class TimeManager{
  constructor(offset=0){
    this.offset = offset;
    this.setTime(false)
    this.time_container = document.querySelector('.time-container');
    this.countdown_container = document.querySelector('.countdown-container')
    this.date_input = document.querySelector('.form-container #date');
    this.year_input = document.querySelector('.form-container #year');
    this.month_input = document.querySelector('.form-container #month');
    this.hours_input = document.querySelector('.countdown-time #hours')
    this.minutes_input = document.querySelector('.countdown-time #minutes')
    this.seconds_input = document.querySelector('.countdown-time #seconds')
    this.title_input = document.querySelector('.form-container #title')
    this.panel = document.querySelector('.panel');
    this.countdown_days = document.querySelector('#countdown_days')
    this.countdown_title = document.querySelector('#countdown_title')
    this.countdown_hours = document.querySelector('#countdown_hours')
    this.countdown_minutes = document.querySelector('#countdown_minutes')
    this.countdown_seconds = document.querySelector('#countdown_seconds')
    this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.date = [31, this.is_leap_year?29:28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.is_leap_year = this.time.getFullYear()%4==0?true:false;
    this.countdown_active = false;
    this.colors = ['#00ffff', '#2196f3', '#4caf50', '#ffeb3b', '#f44336', '#ee82ee', '#ffa500']
    this.format = (num)=>num<10?`0${num}`:num
    this.init();
    this.setDays();
  }
  init(){
    setInterval(()=>{
      this.setTime()
      this.radialRound()
      this.multipleColors(document.querySelector('.countdown-done span'), this.colors)
      this.multipleColors(document.querySelector('#set_countdown'), this.colors)
      this.multipleColors(document.querySelector('#save_countdown'), this.colors)
    }, 1000);
    document.querySelector('#set_countdown').onclick = (e)=>{
      this.toggle(this.panel)
      this.toggle(document.querySelector('.first-layer-container'), false)
    };
    document.querySelector('#save_countdown').onclick = e=>{
      localStorage.setItem('countdown_title', this.title_input.value.length===0?'My Countdown':this.title_input.value)
      this.countDownValidate()
      if(this.countdown_active){
        this.toggle(this.panel, false)
        localStorage.setItem('custom_date', this.setCustomTime(false, true))
        this.toggle(this.countdown_container)
        this.toggle(document.querySelector('.first-layer-container'))
        setInterval(()=>this.setCustomTime(), 1000)
      }
      this.countdown_active = false
    }
    document.querySelector('.close').onclick = (e)=>{
      this.toggle(this.panel, false)
      this.toggle(document.querySelector('.first-layer-container'))
    }
    this.month_input.onchange = (e)=>this.setDays()
    this.setDays()
    if(localStorage['custom_date'] !== undefined) {
      setInterval(()=>this.setCustomTime(), 1000)
      this.toggle(this.countdown_container)
      localStorage.setItem('countdown_title', this.title_input.value.length===0?'My Countdown':this.title_input.value)
    }
    document.querySelector('.countdown-done span').textContent = this.title_input.value.length===0?'My Countdown':this.title_input.value
  }
  toggle(el, show=true){
    if(show){
      el.classList.add('show')
      el.classList.remove('hide')
    }else{
      el.classList.add('hide')
      el.classList.remove('show')
    }
  }
  setTime(update=true){
    let t = new Date()
    this.time = new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), t.getHours()+this.offset, t.getUTCMinutes(), t.getUTCSeconds(), t.getUTCMilliseconds())
    if(update) this.updateTime()
  }
  updateTime(){
    this.time_container.querySelector('.count-date span#hours').textContent = this.format(this.time.getHours())
    this.time_container.querySelector('.count-date span#minutes').textContent = this.format(this.time.getMinutes())
    this.time_container.querySelector('.count-date span#seconds').textContent = this.format(this.time.getSeconds())

    this.time_container.querySelector('#current_time_details p').textContent = `${this.days[this.time.getDay()]}, ${this.month[this.time.getMonth()]} ${this.time.getDate()} ${this.time.getFullYear()}.`
  }
  setDays(){
    this.date_input.querySelectorAll('*').forEach(el=>el.remove())
    let i, option, frag = new DocumentFragment;
    for(i=1;i<=this.date[this.month.map(i=>i.toUpperCase()).indexOf(this.month_input.value.toUpperCase())];i++){
      option = document.createElement('option')
      option.setAttribute('value', i)
      option.textContent = this.format(i)
      frag.appendChild(option)
    }
    this.date_input.appendChild(frag)
  }
  setCustomTime(update=true, overide=false){
    if(localStorage['custom_date'] === undefined || overide){
      this.custom_time = new Date(Number(this.year_input.value), this.month.map(i=>i.toUpperCase()).indexOf(this.month_input.value.toUpperCase()), Number(this.date_input.value), this.custom_hours, this.custom_minutes, this.custom_seconds)
      if(this.countdown_active) localStorage['custom_date'] = this.custom_time
    }else{
      this.custom_time = new Date(localStorage['custom_date'])
    }
    if(update) this.updateCustomTime()
    return this.custom_time
  }
  updateCustomTime(){
    document.querySelector('#finished_countdown_title').textContent = localStorage.getItem('countdown_title')
    this.cm = (this.custom_time - this.time)/1000
    if(this.cm <= 0){
      this.toggle(document.querySelector('.countdown-done'))
      this.toggle(this.countdown_container, false)
      return
    }else{
      this.toggle(document.querySelector('.countdown-done'), false)
      this.toggle(this.countdown_container)
    }
    this.countdown_seconds.textContent = this.format(Math.floor(this.cm % 60))
    this.countdown_minutes.textContent = this.format(Math.floor((this.cm / 60) % 60))
    this.countdown_hours.textContent = this.format(Math.floor((this.cm/60/60) % 24))
    this.countdown_days.textContent = this.format(Math.floor(this.cm/60/60/24))
    document.querySelector('#countdown_title').textContent = this.title_input.value.length===0?'My Countdown':this.title_input.value
    document.querySelector('#countdown_details p').textContent = `${this.days[this.custom_time.getDay()]}, ${this.month[this.custom_time.getMonth()]} ${this.custom_time.getDate()} ${this.custom_time.getFullYear()}`
  }
  countDownValidate(){
    this.custom_hours = this.hours_input.value.length===0?0:Number(this.hours_input.value)
    this.custom_minutes = this.minutes_input.value.length===0?0:Number(this.minutes_input.value)
    this.custom_seconds = this.seconds_input.value.length===0?0:Number(this.seconds_input.value)
    if(this.year_input.value.length !== 0){
      if(this.setCustomTime(false, true)>this.time){
        this.countdown_active = true
      }else this.throwError('Time must be future time')
    }else this.throwError('Fill in all Input')
  }
  throwError(error, time=1500){
    this.error_msg = document.querySelector('.button-container p')
    this.error_msg.classList.add('error')
    this.error_msg.textContent = error
    setTimeout(()=>{
      this.error_msg.classList.remove('error')
      this.error_msg.textContent = ''
    }, time)
    this.countdown_active = false
  }
  // Have Fun
  multipleColors(el, arr){
    const text = el.textContent.split(''), frag = new DocumentFragment()
    el.textContent = ''
    text.forEach(l=>{
      const span = document.createElement('div')
      span.textContent = l
      if(l !== ' ') span.classList.add('letter')
      else span.classList.add('space')
      frag.appendChild(span)
    })
    el.appendChild(frag)
    el.querySelectorAll('.letter').forEach((el, index)=>{
      let arr_index = index%arr.length===0?arr.length-1:(index%arr.length)-1
      el.style.color = arr[arr_index]
    })
  }
  radialRound(){
    let custom_color = this.colors.sort(()=>Math.random() - 0.5)
    // this.colors[Math.floor(Math.random() * this.colors.length)] + '99'
    document.querySelector(':root').style.setProperty('--dynamic-color', custom_color[0] + '99')
    document.querySelector(':root').style.setProperty('--second-dynamic-color', custom_color[Math.round(this.colors.length/2)] + '99')
    document.querySelector(':root').style.setProperty('--third-dynamic-color', custom_color[Math.round(this.colors.length/3)] + '99')
  }
}
const time = new TimeManager(1)
