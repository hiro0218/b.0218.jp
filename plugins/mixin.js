import Vue from 'vue';

Vue.mixin({
  filters: {
    formatDateString: (strDate) => {
      let date = '';

      // convert: string -> date
      try {
        if (typeof strDate === 'string') {
          date = new Date(strDate).toISOString();
        }
      } catch (e) {
        console.log(e);
      }

      // format: yyy/mm/dd
      if (date) {
        date = date.split('T')[0].replace(/-/g, '/');
      }

      return date;
    },
  },
  methods: {
    isDateSameDay: (date1, date2) => {
      return new Date(date1).toDateString() === new Date(date2).toDateString();
    },
  },
});
