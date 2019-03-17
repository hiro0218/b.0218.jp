import Vue from 'vue';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import isSameDay from 'date-fns/is_same_day';
import ja from 'date-fns/locale/ja';

Vue.mixin({
  filters: {
    dateToISOString: (date, strFormat = 'YYYY/MM/DD') => {
      return format(parse(date), strFormat, {
        locale: ja,
      });
    },
  },
  methods: {
    isDateSameDay: (date1, date2) => isSameDay(date1, date2),
  },
});
