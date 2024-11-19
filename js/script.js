const cityInput =document.querySelector('.city-input')
const searchBtn =document.querySelector('.search-btn')

const notFoundSection =document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecestItemsContainer = document.querySelector('.forecest-items-container')




const apikey = '439814a53b7c852d94d9586802f72a7c'

searchBtn.addEventListener('click', () =>{
    if (cityInput.ariaValueMax.trim() !='') {
        updateWeatherInfo(cityInput.value)
        cityInput.value =''
        cityInput.blur()
    }
    
})
cityInput.addEventListener('keydown', (event) =>{
    if (event.key == 'Enter' && 
        cityInput.value.trim() != ''
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
        
    }
})
async function getFetchDate(endpoint,city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`
    const response =await fetch (apiUrl)

    return response.json()
}
function getWeaatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'

}

function getCurrentDate(){
    const date = new Date()
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }
    return date.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city){
    const weatherDate =await getFetchDate('weather' , city)

    if (weatherDate.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherDate);
    const {
        name : country,
        main: {temp, humidity},
        weather: [{id , main}],
        wind: {speed}
    }=weatherDate
    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '℃'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed +'m/s'

    currentDateTxt.textContent = getCurrentDate()    
    weatherSummaryImg.src = `assets/weather/${getWeaatherIcon(id)}`

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
}
async function updateForecastsInfo(city){
    const forecastsDate = await getFetchDate('forecast', city)

    const timeTakon = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    forecestItemsContainer.innerHTML = ''

    forecastsDate.list.forEach(forecastWeather =>{
        if (forecastWeather.dt_txt.includes(timeTakon) &&
                 !forecastWeather.dt_txt.includes(todayDate)){
                    updateForecastItems(forecastWeather)
        }
    })
}

function updateForecastItems(WeatherDate){
    console.log(WeatherDate);
    
    const {
        dt_txt: date,
        main: {temp},
        weather: [{id}],
    }=WeatherDate

    const dateTaken = new Date(date)
    const dateOption = {
        day :'2-digit',
        month : 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItems =`
                 <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                    <img src="./assets/weather/${getWeaatherIcon(id)}" alt="" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)} ℃</h5>
                </div>
    `
    forecestItemsContainer.insertAdjacentHTML('beforeend', forecastItems)
}

function showDisplaySection(section){
    [weatherInfoSection,searchCitySection,notFoundSection ]
    .forEach (section =>section.style.display = 'none')
    section.style.display= 'flex'
}