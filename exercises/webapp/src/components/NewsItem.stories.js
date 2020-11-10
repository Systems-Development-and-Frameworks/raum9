import NewsItem from './NewsItem';
import {action} from "@storybook/addon-actions";

export default {
  title: 'NewsItem',
  component: NewsItem,
  argTypes: {},
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {NewsItem},
  methods: {onRemove: action("news-remove"), onUpdate: action("update")},
  template: '<NewsItem @news-remove="onRemove" @update="onUpdate" v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
  newsItem: {
    id: 0,
    title: 'this is a test entry.',
    voteCount: 0
  }
};
