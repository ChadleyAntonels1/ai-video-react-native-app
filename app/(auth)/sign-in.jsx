import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import {images} from '../../constants'
import CustomeButton from '../../components/CustomeButton'
import FormField from '../../components/FormField'
import { Link, router } from 'expo-router'
import { signIn } from '../../lib/appwrite'

const SignIn = () => {

  const [form, setForm ] = useState({
    email:'',
    password:'',
  })

  const [isSubmitting, SetisSubmitting] = useState(false)

  const submit = async () => {
    if( !form.email === '' || !form.password === ''){
      Alert.alert('Error','Please fill in all the fields')
    }

    SetisSubmitting(true);

    try {
      await signIn(form.email, form.password)
      setUser(result);
      setIsLogged(true)

      //set to global state

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)

    } finally {
      SetisSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo}
                 resizeMode='contain'
                 className="w-[115px] h-[35px]"/>

          <Text className=" text-2xl text-white text-semibold mt-10 font-pmedium"> Log into Aora</Text>
          <FormField title="Email"
                     value={form.email}
                     handleChangeText={(e) => setForm({...form, email:e})}
                     otherStyles="mt-7"
                     keyboardType="email-address"
          />

          <FormField title="Password"
                     value={form.password}
                     handleChangeText={(e) => setForm({...form, password:e})}
                     otherStyles="mt-7"
          />

          <CustomeButton title='Sign In'
                         handlePress={submit}
                         containerStyles="mt-7"
                         isLoading={isSubmitting}/>
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link href="/sign-up"
                  className=" text-lg font-medium text-secondary">Sign up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn