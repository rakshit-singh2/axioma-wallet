import { Form, Input, Button, message } from 'antd';
import { addUserChain } from '../../helpers/chains';
// Translate 
import { useTranslation } from 'react-i18next';
// Translate

const AddChainForm = ({ fetchChainOptions, setAddChainView, setIsModalVisible }) => {
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
  const [form] = Form.useForm();
  const handleAddChain = async (values) => {
    try {
      await addUserChain(values.name, values.ticker, values.rpcUrl, values.blockExplorerUrl);
      fetchChainOptions();
      message.success('Chain added successfully!');
    } catch (error) {
      message.error(`Unable to add chain. Please verify RPC URL: ${error.message}`);
    } finally {
      setAddChainView(false);
      form.resetFields();
      setIsModalVisible(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleAddChain}
      layout="vertical"
      style={{ maxHeight: 'calc(60vh - 50px)', overflowY: 'scroll', scrollbarWidth: 'none' }}
    >
      <Form.Item
        name="name"
        label={t('Name')}
        rules={[{ required: true, message: 'Please enter the name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ticker"
        label={t('Ticker')}
        rules={[{ required: true, message: 'Please enter the ticker' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="rpcUrl"
        label={t('RPC URL')}
        rules={[{ required: true, message: 'Please enter the RPC URL' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="blockExplorerUrl"
        label={t('Block Explorer URL')}
        rules={[{ required: true, message: 'Please enter the Block Explorer URL' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          {t('Add Chain')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddChainForm;
