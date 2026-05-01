import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  allowDecimal?: boolean;
  allowSign?: boolean;
};

export function NumberPad({ value, onChange, onSubmit, disabled, allowDecimal = true, allowSign = false }: Props) {
  const handleKey = (k: string) => {
    if (disabled) return;
    if (k === 'OK') {
      if (value.length > 0) onSubmit();
      return;
    }
    if (k === 'BACK') {
      onChange(value.slice(0, -1));
      return;
    }
    if (k === 'CLEAR') {
      onChange('');
      return;
    }
    if (k === '.') {
      if (!allowDecimal || value.includes('.') || value.length === 0) return;
      onChange(value + '.');
      return;
    }
    if (k === '-') {
      if (!allowSign) return;
      if (value.length === 0) onChange('-');
      else if (value === '-') onChange('');
      return;
    }
    if (value.length >= 10) return;
    onChange(value + k);
  };

  const submitDisabled = disabled || value.length === 0;
  const decimalDisabled = disabled || !allowDecimal || value.includes('.') || value.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.numbersCol}>
        <View style={styles.row}>
          <NumKey label="7" onPress={() => handleKey('7')} disabled={disabled} />
          <NumKey label="8" onPress={() => handleKey('8')} disabled={disabled} />
          <NumKey label="9" onPress={() => handleKey('9')} disabled={disabled} />
        </View>
        <View style={styles.row}>
          <NumKey label="4" onPress={() => handleKey('4')} disabled={disabled} />
          <NumKey label="5" onPress={() => handleKey('5')} disabled={disabled} />
          <NumKey label="6" onPress={() => handleKey('6')} disabled={disabled} />
        </View>
        <View style={styles.row}>
          <NumKey label="1" onPress={() => handleKey('1')} disabled={disabled} />
          <NumKey label="2" onPress={() => handleKey('2')} disabled={disabled} />
          <NumKey label="3" onPress={() => handleKey('3')} disabled={disabled} />
        </View>
        <View style={styles.row}>
          <NumKey label="0" onPress={() => handleKey('0')} disabled={disabled} flex={2} />
          <NumKey
            label="."
            onPress={() => handleKey('.')}
            disabled={decimalDisabled}
          />
        </View>
      </View>
      <View style={styles.actionsCol}>
        <NumKey
          icon={<Ionicons name="backspace-outline" size={32} color={colors.text} />}
          onPress={() => handleKey('BACK')}
          disabled={disabled || value.length === 0}
          bg={colors.surfaceAlt}
        />
        <NumKey
          label="C"
          onPress={() => handleKey('CLEAR')}
          disabled={disabled || value.length === 0}
          bg={colors.dangerLight}
          color={colors.danger}
        />
        <NumKey
          icon={<Ionicons name="checkmark-sharp" size={44} color={colors.textInverse} />}
          onPress={() => handleKey('OK')}
          disabled={submitDisabled}
          bg={colors.success}
          flexHeight={2}
        />
      </View>
    </View>
  );
}

function NumKey({
  label,
  icon,
  onPress,
  disabled,
  bg = colors.surface,
  color = colors.text,
  fontSize = 28,
  flex = 1,
  flexHeight,
}: {
  label?: string;
  icon?: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  bg?: string;
  color?: string;
  fontSize?: number;
  flex?: number;
  flexHeight?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.key,
        {
          backgroundColor: bg,
          flex: flexHeight ? flexHeight : flex,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      {icon ? icon : <Text style={[styles.keyText, { color, fontSize }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  numbersCol: {
    flex: 3,
    gap: spacing.sm,
  },
  actionsCol: {
    flex: 1,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  key: {
    minHeight: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  keyText: { ...typography.h2 },
});
