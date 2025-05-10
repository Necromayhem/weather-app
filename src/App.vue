<script setup>
import { ref, onMounted, computed } from "vue";
import { BASE_URL, API_KEY } from "./constans";
import HighLights from "./components/HighLights.vue";
import WeatherSummary from "./components/WeatherSummary.vue";
import Coords from "./components/Coords.vue";
import Humidity from "./components/Humidity.vue";
import { capitalizeFirstLetter } from "./utils";

const city = ref("Moscow");
const weatherInfo = ref(null);
const isError = computed(() => {
  return weatherInfo.value?.cod !== 200;
})

async function getWeather() {
  if (!city.value) {
    console.error("City is empty");
    weatherInfo.value = { cod: 400, message: "Please enter a city name" };
    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}?q=${city.value}&units=metric&appid=${API_KEY}`
    );

    const data = await response.json();
    
    if (!response.ok || data.cod >= 400) {
      throw data; 
    }

    weatherInfo.value = data;
  } catch (error) {
    console.error("Fetch error:", error);
    weatherInfo.value = {
      cod: error.cod || 500,
      message: error.message || "Failed to fetch weather data"
    };
  }
}

onMounted(() => {
  if (city.value) getWeather();
});
</script>

<template>
  <div class="page">
    <main class="main">
      <div class="container">
        <div class="laptop">
          <div class="sections">
            <section :class="['section', 'section-left', { 'section-error': isError }]">
              <div class="info">
                <div class="city-inner">
                  <input
                    class="search"
                    type="text"
                    v-model="city"
                    @keyup.enter="getWeather"
                  />
                </div>
                <WeatherSummary 
                v-if="!isError"
                :weatherInfo="weatherInfo" 
                />
                <div v-else class="error">
                  <div class="error-title">
                    Oooops! Something went wrong
                  </div>
                  <div 
                  class="error-message"
                  v-if="weatherInfo?.message"
                  >
                    {{ capitalizeFirstLetter(weatherInfo?.message) }}
                  </div>
                </div>
              </div>
            </section>
            <section 
            class="section section-right"
             v-if="!isError"
            >
              <HighLights
              :weatherInfo="weatherInfo" 
              />
            </section>
          </div>
          <div 
          class="sections"
          v-if="!isError"
          >
            <Coords :coord="weatherInfo.coord"/>

            <Humidity :humidity="weatherInfo.main.humidity"/>
            
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="sass" scoped>

@use './assets/styles/main'

.page
  position: relative
  display: flex
  justify-content: center
  align-items: center
  min-height: 100vh
  padding: 20px 0
  background-color: #59585d

.laptop
  width: 100%
  padding: 20px
  background-color: #0e100f
  border-radius: 25px

.sections
  display: flex
  width: 100%

  @media (max-width: 767px)
    flex-direction: column

.section-left
  width: 30%
  padding-right: 10px

  @media (max-width: 767px)
    width: 100%
    padding-right: 0

  &.section-error
    min-width: 235px
    width: auto
    padding-right: 0

.section-right
  width: 70%
  padding-left: 10px

  @media (max-width: 767px)
    width: 100%
    margin-top: 16px
    padding-left: 0

.city-inner
  position: relative
  display: inline-block
  width: 100%

  &::after
    content: ''
    position: absolute
    top: 0
    right: 10px
    width: 25px
    height: 25px
    background: url('./assets/img/search.svg') no-repeat 50% 50%
    background-size: contain
    transform: translateY(50%)
    cursor: pointer

.info
  height: 100%
  padding: 16px
  background: url('./assets/img/gradient-1.jpg') no-repeat 50% 50%
  background-size: cover
  border-radius: 25px

.search
  width: 100%
  padding: 16px
  font-family: 'Inter', Arial, sans-serif
  color: $white
  background-color: rgba(0, 0, 0, 0.75)
  border-radius: 16px
  border: none
  outline: none
  cursor: pointer

.section-bottom
  width: 50%
  margin-top: 16px

  @media (max-width: 767px)
    width: 100%

.error
  padding-top: 20px

  &-title
    font-size: 18px
    font-weight: 700

  &-message
     padding-top: 10px
     font-size: 18px     
</style>
