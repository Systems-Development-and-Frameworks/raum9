import HackerNews from './HackerNews';

export default {
  title: 'HackerNews',
  component: HackerNews,
  argTypes: {},
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {HackerNews},
  template: '<HackerNews @onClick="onClick" v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
  initialNews: [{
    id: 0,
    title: 'Message 1',
    voteCount: 2
  }, {
    id: 1,
    title: 'Message 2',
    voteCount: 4
  }],
};

export const Empty = Template.bind({});
Empty.args = {initialNews: []}
