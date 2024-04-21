import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, refresh, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { DatabaseConnection } from "../../database/database";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useFocusEffect, useNavigation } from "@react-navigation/native";


export default function TodosClientes() {
    const db = new DatabaseConnection.getConnection
    const navigation = useNavigation()
    const [todos, setTodos] = useState([])

    useFocusEffect(
        useCallback(() => {
            atualizaCliente();
            console.log("tabela atualizada")
        }, [])
    );


    function navegaEditar(cliente) {
        navigation.navigate('Editar', { cliente });
    }

    const atualizaCliente = () => {
        db.transaction(tx => {
            tx.executeSql(
                `select 
                    c.id,
                    c.nome,
                    c.data_nasc,
                    t.numero
                    from tbl_clientes c
                    join tbl_telefones_has_tbl_pessoa ct on c.id=ct.id_pessoa
                    join tbl_telefones t on ct.id_telefone = t.id;`,
                // `select * from tbl_telefones;`,
                [],
                (_, { rows }) => {
                    setTodos(rows._array);
                    console.log(rows._array)
                },
                (error) => console.log("Erro ao selecionar clientes:", error)
            );
        });

    };
    useEffect(() => {
        atualizaCliente();
    }, []);



    const excluirClientes = idCliente => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'DELETE FROM tbl_telefones_has_tbl_pessoa WHERE id_pessoa = ?',
                    [idCliente],
                    (_, result) => {
                        if (result.rowsAffected > 0) {
                            console.log('Associações de telefone excluídas com sucesso');
    
                            tx.executeSql(
                                'DELETE FROM tbl_telefones WHERE id IN (SELECT id_telefone FROM tbl_telefones_has_tbl_pessoa WHERE id_pessoa = ?)',
                                [idCliente],
                                (_, result) => {
                                    if (result.rowsAffected > 0) {
                                        console.log('Telefones excluídos com sucesso');
    
                                        tx.executeSql(
                                            'DELETE FROM tbl_clientes WHERE ID = ?',
                                            [idCliente],
                                            (_, { rowsAffected }) => {
                                                if (rowsAffected > 0) {
                                                    atualizaRegistros();
                                                    Alert.alert('Sucesso', 'Registro excluído com sucesso.');
                                                } else {
                                                    Alert.alert('Erro', 'Nenhum registro foi excluído, verifique e tente novamente!');
                                                }
                                            },
                                            (_, error) => console.error('Erro ao excluir o cliente:', error)
                                        );
                                    } else {
                                        console.error('Erro ao excluir telefones');
                                    }
                                },
                                (_, error) => console.error('Erro ao excluir telefones:', error)
                            );
                        } else {
                            console.error('Erro ao excluir associações de telefone');
                        }
                    },
                    (_, error) => console.error('Erro ao excluir associações de telefone:', error)
                );
            }
        );
    };
    

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView>
                {todos.map(cliente => (
                    <View key={cliente.id} style={styles.itemContainer}>
                        <Text style={styles.text}>ID: {cliente.id}</Text>
                        <Text style={styles.text}>Nome: {cliente.nome}</Text>
                        <Text style={styles.text}>Data Nascimento: {cliente.data_nasc}</Text>
                        <Text style={styles.text}>Numero: {cliente.numero}</Text>

                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TouchableOpacity onPress={() => navegaEditar(cliente)}>
                                <FontAwesome6 name='pen-to-square' color={'green'} size={24} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                Alert.alert(
                                    "Atenção!",
                                    'Deseja excluir o registro selecionado?',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => excluirClientes(cliente.id)
                                            
                                        },
                                        {
                                            text: 'Cancelar',
                                            onPress: () => { },

                                        }
                                    ],
                                )
                            }}>
                                <FontAwesome6 name='trash-can' color={'red'} size={24} />
                            </TouchableOpacity>

                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',

    },
    itemContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        width: 250,
        height: 180,
    },
    text: {
        marginBottom: 5,
    },
})
