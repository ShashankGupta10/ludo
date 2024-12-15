import React, { useState, useContext } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Modal } from "react-native";
import axios from "axios";
import { DataContext } from "@/context/DataContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { HTTP_SERVER_URL } from "@/config";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const { data, setData } = useContext(DataContext);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const navigation = useNavigation();

  const createRoom = async () => {
    const response = await axios.post(`${HTTP_SERVER_URL}/api/v1/room/create`);
    // navigation.navigate("WaitingArea", { roomId: response.data.id });
  };

  return (
    <View className="flex-1 justify-center items-center bg-yellow-500">
      <Image source={require("/assets/ludo-bg.png")} className="w-48 h-48" />
      <View className="flex-row gap-4 mt-8">
        {/* Join Room Button */}
        <TouchableOpacity
          className="bg-red-600 rounded-lg px-6 py-4 animate-bounce"
          onPress={() => setJoinModalVisible(true)}
        >
          <Text className="text-xl text-white font-bold">Join Room</Text>
        </TouchableOpacity>

        {/* Create Room Button */}
        <TouchableOpacity
          className="bg-blue-700 rounded-lg px-6 py-4 animate-bounce delay-200"
          onPress={() => setCreateModalVisible(true)}
        >
          <Text className="text-xl text-white font-bold">Create Room</Text>
        </TouchableOpacity>
      </View>

      {/* Join Room Modal */}
      <Modal
        visible={joinModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-4/5">
            <Text className="text-lg font-bold mb-2">Join Room</Text>
            <Text className="text-sm text-gray-600 mb-4">Enter the room ID to join the game room.</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
              placeholder="Enter the room ID..."
              value={roomId}
              onChangeText={setRoomId}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your name..."
              value={data.name}
              onChangeText={(text) => setData({ ...data, name: text })}
            />
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-gray-800 px-4 py-2 rounded-lg"
                onPress={() => {
                  setJoinModalVisible(false);
                  // navigation.navigate("WaitingArea", { roomId });
                }}
              >
                <Text className="text-white font-bold">Join Room</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Room Modal */}
      <Modal
        visible={createModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-4/5">
            <Text className="text-lg font-bold mb-2">Create Room</Text>
            <Text className="text-sm text-gray-600 mb-4">
              Enter your name to create a ludo game room with you as the admin.
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your name..."
              value={data.name}
              onChangeText={(text) => setData({ ...data, name: text })}
            />
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-gray-800 px-4 py-2 rounded-lg"
                onPress={() => {
                  setCreateModalVisible(false);
                  createRoom();
                }}
              >
                <Text className="text-white font-bold">Create Room</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
