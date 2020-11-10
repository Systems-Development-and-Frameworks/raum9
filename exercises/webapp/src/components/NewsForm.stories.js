import NewsForm from './NewsForm';
import {action} from "@storybook/addon-actions";

export default {
  title: 'NewsForm',
  component: NewsForm,
  argTypes: {},
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {NewsForm},
  methods: {onCreateNewsItem: action('onCreateNewsItem'), onSortOrder: action('onSortOrder')},
  template: '<NewsForm @news-add="onCreateNewsItem" @switch="onSortOrder" v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {};
