import NewsItem from './NewsItem';

export default {
  title: 'NewsItem',
  component: NewsItem,
  argTypes: {
/*    backgroundColor: { control: 'color' },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },*/
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NewsItem },
  template: '<NewsItem @onClick="onClick" v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
  newsItem: {
    id: 0,
    title: "this is a test entry.",
    voteCount: 0
  }
};
