import NewsForm from './NewsForm';

export default {
  title: 'NewsForm',
  component: NewsForm,
  argTypes: {
/*    backgroundColor: { control: 'color' },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },*/
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NewsForm },
  template: '<NewsForm @onClick="onClick" v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {};
