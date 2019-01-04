import Vue from 'vue';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import isSameDay from 'date-fns/is_same_day';
import ja from 'date-fns/locale/ja';

Vue.mixin({
  filters: {
    dateToISOString: date => {
      return format(parse(date), 'YYYY/MM/DD HH:mm', {
        locale: ja,
      });
    },
  },
  methods: {
    isDateSameDay: (date1, date2) => isSameDay(date1, date2),
  },
});
