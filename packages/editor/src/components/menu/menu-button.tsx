import { useRef } from "react";
import { Flex, Text } from "rebass";
import Button from "../button";
import { Icon } from "../../toolbar/components/icon";
import { Icons } from "../../toolbar/icons";
import { useToolbarLocation } from "../../toolbar/stores/toolbar-store";
import { MenuButton } from "./types";

type MenuButtonProps = {
  item: MenuButton;
  isFocused?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick: (e?: any) => void;
};

export function MenuButton(props: MenuButtonProps) {
  const { item, isFocused, onMouseEnter, onMouseLeave, onClick } = props;
  const { title, key, icon, tooltip, isDisabled, isChecked, menu, modifier } =
    item;
  const itemRef = useRef<HTMLButtonElement>(null);
  const toolbarLocation = useToolbarLocation();
  const isBottom = toolbarLocation === "bottom";

  return (
    <Flex
      as="li"
      sx={{ flexShrink: 0, flexDirection: "column" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Button
        id={key}
        data-test-id={`MenuButton-${key}`}
        key={key}
        ref={itemRef}
        tabIndex={-1}
        variant="menuitem"
        title={tooltip}
        disabled={isDisabled}
        onClick={onClick}
        sx={{
          bg: isFocused && !isBottom ? "hover" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ":hover": {
            bg: isBottom ? "transparent" : "hover",
          },
        }}
      >
        <Flex>
          {icon && (
            <Icon
              path={Icons[icon]}
              color={"text"}
              size={"medium"}
              sx={{ mr: 2 }}
            />
          )}
          <Text as="span" variant={"body"}>
            {title}
          </Text>
        </Flex>
        {isChecked || menu || modifier ? (
          <Flex sx={{ ml: 4 }}>
            {isChecked && <Icon path={Icons.check} size={14} />}
            {menu && <Icon path={Icons.chevronRight} size={14} />}
            {modifier && (
              <Text
                as="span"
                sx={{
                  fontFamily: "body",
                  fontSize: "menu",
                  color: "fontTertiary",
                }}
              >
                {modifier}
              </Text>
            )}
          </Flex>
        ) : null}
      </Button>
    </Flex>
  );
}
