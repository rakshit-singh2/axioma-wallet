import { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { setLastChain, getAllChains } from '../../helpers/storage';
import { DownOutlined } from '@ant-design/icons';
import ChainList from './ChainList';
import AddChainForm from './AddChainForm';
import EditChainForm from './EditChainForm';
// Translate 
import { useTranslation } from 'react-i18next';
// Translate
const ChainSelector = ({ selectedChain, setSelectedChain }) => {
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chainOptions, setChainOptions] = useState([]);
  const [addChainView, setAddChainView] = useState(false);
  const [editChainView, setEditChainView] = useState(false);
  const [allChains, setAllChains] = useState({});
  const [chainEdit, setChainEdit] = useState(null);

  const fetchChainOptions = async () => {
    try {
      const chains = await getAllChains();
      setAllChains(chains);

      const options = Object.entries(chains).map(([hexString, chain]) => ({
        label: chain.name,
        value: hexString,
        userAdded: chain.userAdded,
      }));
      setChainOptions(options);
    } catch (error) {
      console.error("Error fetching chains:", error);
    }
  };

  const handleChainSelect = (val) => {
    setLastChain(val);
    setSelectedChain(val);
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchChainOptions();
  }, []);

  const chain = selectedChain ? allChains[selectedChain] : null;

  return (
    <>
      <Button
        shape="circle"
        onClick={() => setIsModalVisible(true)}
        style={{
          width: '50px',
          height: '30px',
          border: 'none',
          background: '#f0f0f0',
          borderRadius: '25px',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
        onFocus={(e) => e.currentTarget.style.outline = 'none'}
      >
        {selectedChain && chain ? (
          <img
            src={`svg/color/${chain.ticker.toLowerCase()}.svg`}
            style={{ width: '20px', height: '20px' }}
          />
        ) : (
          <span>Select</span>
        )}
        <DownOutlined />
      </Button>
      <Modal
        title={t('Select a Chain')}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setAddChainView(false);
          setEditChainView(false);
          setChainEdit(null);
        }}
        footer={null}
        width={300}
        closable={false}
        centered
      >
        {editChainView && chainEdit ? (
          <EditChainForm
            fetchChainOptions={fetchChainOptions}
            setEditChainView={setEditChainView}
            setIsModalVisible={setIsModalVisible}
            chainEdit={chainEdit}
            setChainEdit={setChainEdit}
          />
        ) : addChainView ? (
          <AddChainForm
            fetchChainOptions={fetchChainOptions}
            setAddChainView={setAddChainView}
            setIsModalVisible={setIsModalVisible}
          />
        ) : (
          <ChainList
            chainOptions={chainOptions}
            selectedChain={selectedChain}
            handleChainSelect={handleChainSelect}
            setAddChainView={setAddChainView}
            setIsModalVisible={setIsModalVisible}
            setSelectedChain={setSelectedChain}
            setEditChainView={setEditChainView}
            setChainEdit={setChainEdit}
          />
        )}
      </Modal>
    </>
  );
};

export default ChainSelector;
