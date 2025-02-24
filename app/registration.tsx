import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import ApiService from './services/apiService';
import Util from './util/utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Outlet Data
const OUTLETS = [
  { id: 1, name: 'Main Outlet' },
  { id: 2, name: 'Downtown Branch' },
  { id: 3, name: 'Suburban Location' },
  { id: 4, name: 'City Center' },
];

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  outlet: string;
  dob: Date;
  gender: string;
  businessRegistrationNumber?: string;  // Make this optional
};

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Registration: undefined;
  Dashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Registration'>;

export default function Registration ({ navigation }: Props) {
  const [type, setType] = useState<'customer' | 'business'>('customer');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    outlet: OUTLETS[0].name,
    dob: new Date(),
    gender: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validation rules
    if (!formData.username) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required.';
      isValid = false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.contactNumber || !phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Valid contact number is required.';
      isValid = false;
    }
    if (type === 'business' && !formData.businessRegistrationNumber) {
      newErrors.businessRegistrationNumber = 'Business registration number is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || formData.dob;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({ ...formData, dob: currentDate });
  };


  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const registrationData = {
          username: formData.username,
          password: formData.password,
          full_name: formData.name,
          email: formData.email,
          mobile_number: formData.contactNumber,
          address: formData.address,
          outlet: formData.outlet,
          date_of_birth: formData.dob.toISOString(),  // Convert Date to string (ISO format)
          gender: formData.gender,
          type,
          ...(type === 'business' ? { business_registration_number: formData.businessRegistrationNumber } : {})
        };

        const response = await ApiService.post<any>('/register', 
          registrationData
        );

        console.log('response ' + response)

        Alert.alert('Success', 'Registration Successful!', [
          {
            text: 'OK',
            onPress: () => {
              // Add a small delay for debugging
              setTimeout(() => {
                navigation.navigate('Login');
              }, 500); // Small timeout to simulate the alert dismissal and then navigate
            }
          }
        ]);

      } catch (error : any) {
        console.error('Registration Error', error);
        Alert.alert('Failure', ''+error.error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Customer Registration</Text>

      {/* Customer Type */}
      <View style={styles.pickerContainer}>
        <Text>Customer Type</Text>
        <Picker
          selectedValue={type}
          onValueChange={(value) => setType(value)}
        >
          <Picker.Item label="General Customer" value="general" />
          <Picker.Item label="Business Customer" value="business" />
        </Picker>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      {type === 'business' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Business Registration Number"
            value={formData.businessRegistrationNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, businessRegistrationNumber: text })
            }
          />
          {errors.businessRegistrationNumber && (
            <Text style={styles.errorText}>{errors.businessRegistrationNumber}</Text>
          )}
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
        keyboardType="phone-pad"
      />
      {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
        multiline
      />

      {/* Outlet Picker */}
      <View style={styles.pickerContainer}>
        <Text>Outlet</Text>
        <Picker
          selectedValue={formData.outlet}
          onValueChange={(value) => setFormData({ ...formData, outlet: value })}
        >
          {OUTLETS.map((outlet) => (
            <Picker.Item key={outlet.id} label={outlet.name} value={outlet.name} />
          ))}
        </Picker>
      </View>

      {/* Date of Birth */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>
          Date of Birth: {formData.dob.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={formData.dob}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Gender Picker */}
      <View style={styles.pickerContainer}>
        <Text>Gender</Text>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(value) => setFormData({ ...formData, gender: value })}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginVertical: 10 },
  pickerContainer: { marginVertical: 10 },
  dateText: { fontSize: 16, color: '#333', padding: 10 },
  errorText: { color: 'red', marginBottom: 10 },
  submitButton: { backgroundColor: 'blue', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 30 },
  submitButtonText: { color: 'white', fontWeight: 'bold' },
});

// export default Registration;
