import Vue from 'vue';
import isSameDay from 'date-fns/is_same_day';

Vue.mixin({
  filters: {
    formatDateString: strDate => {
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
    isDateSameDay: (date1, date2) => isSameDay(date1, date2),
  },
});
