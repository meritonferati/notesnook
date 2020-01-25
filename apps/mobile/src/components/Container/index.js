import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Feather';
import {br, opacity, pv, SIZE, WEIGHT} from '../../common/common';
import {useTracked} from '../../provider';
import {eSubscribeEvent, eUnSubscribeEvent} from '../../services/eventManager';
import {eScrollEvent} from '../../services/events';
import {getElevation} from '../../utils/utils';
import {Header} from '../header';
import {Search} from '../SearchInput';
import SelectionHeader from '../SelectionHeader';
export const AnimatedSafeAreaView = Animatable.createAnimatableComponent(
  SafeAreaView,
);

const AnimatedTouchableOpacity = Animatable.createAnimatableComponent(
  TouchableOpacity,
);

export const Container = ({
  children,
  bottomButtonOnPress,
  bottomButtonText,
  noBottomButton = false,
  data = [],
}) => {
  // State
  const [state, dispatch] = useTracked();
  const {colors, selectionMode, searchResults} = state;
  const [text, setText] = useState('');

  const [hideHeader, setHideHeader] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);

  let offsetY = 0;
  let countUp = 1;
  let countDown = 0;
  let searchResult = [];

  const onScroll = y => {
    if (searchResults.length > 0) return;
    if (y < 30) setHideHeader(false);
    if (y > offsetY) {
      if (y - offsetY < 150 || countDown > 0) return;
      countDown = 1;
      countUp = 0;
      setHideHeader(true);
    } else {
      if (offsetY - y < 150 || countUp > 0) return;
      countDown = 0;
      countUp = 1;
      setHideHeader(false);
    }
    offsetY = y;
  };

  const onChangeText = value => {
    //setText(value);
  };
  const onSubmitEditing = async () => {
    if (!text || text.length < 1) {
      clearSearch();
    } else {
      //setKeyword(text);
      searchResult = await db.searchNotes(text);

      if (searchResult && searchResult.length > 0) {
        //setSearchResults([...searchResult]);
      } else {
        ToastEvent.show('No search results found', 'error', 3000, () => {}, '');
      }
    }
  };

  const onBlur = () => {
    if (text && text.length < 1) {
      clearSearch();
    }
  };

  const onFocus = () => {
    //setSearch(false);
  };

  const clearSearch = () => {
    searchResult = null;
    //setSearchResults([...[]]);
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        setButtonHide(true);
      }, 300);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => {
        setButtonHide(false);
      }, 300);
    });
    return () => {
      Keyboard.removeListener('keyboardDidShow', () => {
        setTimeout(() => {
          setButtonHide(true);
        }, 300);
      });
      Keyboard.removeListener('keyboardDidHide', () => {
        setTimeout(() => {
          setButtonHide(false);
        }, 300);
      });
    };
  }, []);

  useEffect(() => {
    eSubscribeEvent(eScrollEvent, onScroll);

    return () => {
      eUnSubscribeEvent(eScrollEvent, onScroll);
    };
  });

  // Render

  return (
    <AnimatedSafeAreaView
      transition="backgroundColor"
      duration={300}
      style={{
        height: '100%',

        backgroundColor: colors.bg,
      }}>
      <KeyboardAvoidingView
        behavior="padding"
        enabled={Platform.OS === 'ios' ? true : false}
        style={{
          height: '100%',
        }}>
        <SelectionHeader />

        <Animatable.View
          animation="fadeIn"
          useNativeDriver={true}
          duration={600}
          delay={700}>
          <Animatable.View
            transition={['backgroundColor', 'opacity', 'height']}
            duration={300}
            style={{
              position: 'absolute',
              backgroundColor: colors.bg,
              zIndex: 10,
              height: selectionMode ? 0 : null,
              opacity: selectionMode ? 0 : 1,
              width: '100%',
            }}>
            <Header
              menu
              hide={hideHeader}
              verticalMenu
              showSearch={() => {
                setHideHeader(false);
                countUp = 0;
                countDown = 0;
              }}
              colors={colors}
              heading={'Home'}
              canGoBack={false}
              customIcon="menu"
            />

            {data[0] ? (
              <Search
                clear={() => setText('')}
                hide={hideHeader}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
                placeholder="Search your notes"
                onBlur={onBlur}
                onFocus={onFocus}
                clearSearch={clearSearch}
                value={text}
              />
            ) : null}
          </Animatable.View>
        </Animatable.View>

        {children}

        {noBottomButton ? null : (
          <Animatable.View
            transition={['translateY', 'opacity']}
            useNativeDriver={true}
            duration={250}
            style={{
              width: '100%',
              opacity: buttonHide ? 0 : 1,
              position: 'absolute',
              paddingHorizontal: 12,
              zIndex: 10,
              bottom: 10,
              transform: [
                {
                  translateY: buttonHide ? 200 : 0,
                },
              ],
            }}>
            <AnimatedTouchableOpacity
              onPress={bottomButtonOnPress}
              activeOpacity={opacity}
              style={{
                ...getElevation(5),
                width: '100%',

                alignSelf: 'center',
                borderRadius: br,
                backgroundColor: colors.accent,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 0,
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                  padding: pv,
                  paddingVertical: pv + 5,
                }}>
                <Icon name="plus" color="white" size={SIZE.xl} />
                <Text
                  style={{
                    fontSize: SIZE.md,
                    color: 'white',
                    fontFamily: WEIGHT.regular,
                    textAlignVertical: 'center',
                  }}>
                  {'  ' + bottomButtonText}
                </Text>
              </View>
            </AnimatedTouchableOpacity>
          </Animatable.View>
        )}
      </KeyboardAvoidingView>
    </AnimatedSafeAreaView>
  );
};

export default Container;
