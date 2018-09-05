let customHealth = Vue.component('custom-health', {
  props: ['health', 'isMonster'],
  data: function() {
    return {
      styleObj: {display: 'flex', justifyContent: 'flex-end', paddingBottom: '50px'}
    }
  },
  template: `
  <div class="row" :style="[isMonster ? styleObj : {}]">
  <div class="column healthbar">
  <div class="healthbar" 
    style="background-color: green; width: 80%;"
    :style="{width: health + '%'}">
  {{health}}
  </div>
</div>
</div>
  `
});

new Vue({
  el: '#app',
  data: {
    playerHealth: 100,
    monsterHealth: 100,
    isGameRunning: false,
    useSpecialAttack: true,
    gameResult: '',
    battleLog: []
  },
  methods: {
    startNewGame: function() {
      this.gameResult = '';
      this.isGameRunning = true;
    },
    resetGame: function() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.battleLog = [];
      this.isGameRunning = true;
      this.gameResult = '';
    },
    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    battle: function(special) {
      this.playerTurn(special);
      if (this.monsterHealth === 0) {
        this.gameResult = 'You have slain the monster!!';
        this.isGameRunning = false;
        return;
      }
      this.monsterTurn();
      if (this.playerHealth === 0) {
        this.gameResult = 'Oops you\'re dead!!';
        this.isGameRunning = false;
      }
    },
    runAway: function() {
      this.gameResult = 'You escaped the monster!!';
      this.isGameRunning = false;
    },
    inflictDamage: function(initialHealth, min, max) {
      let damage = this.getRandomInt(min, max);
      let remainingHealth = initialHealth - damage;
      return remainingHealth <= 0 ? 0 : remainingHealth;
    },
    healPlayer: function() {
      let amountToHeal = this.getRandomInt(20, 25);
      let remainingHealth = this.playerHealth + amountToHeal;
      this.playerHealth = remainingHealth <= 100 ? remainingHealth : 100;
      this.battleLog.push({isPlayer: true, value: `You heal yourself for ${amountToHeal}`});
      this.monsterTurn();
    },
    playerTurn: function(special) {
      let damageDone = special ? this.getRandomInt(25, 30) : this.getRandomInt(10, 20);
      this.monsterHealth = this.monsterHealth - damageDone < 0 ? 0 : this.monsterHealth - damageDone;
      this.battleLog.push({isPlayer: true, value: `${special ? 'CRITICAL HIT!! ' : ''}You attack the monster for ${damageDone} !!`});
    },
    monsterTurn: function() {
      let damageDone = this.getRandomInt(15, 20);
      this.playerHealth = this.playerHealth - damageDone < 0 ? 0 : this.playerHealth - damageDone;
      this.battleLog.push({isPlayer: false, value: `Monster attacks you for ${damageDone} !!`});
    }
  },
  components: {
    'custom-health': customHealth
  }
})
